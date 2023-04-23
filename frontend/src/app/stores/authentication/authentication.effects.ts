import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
    AbilityAction,
    AbilitySubject,
    ACTION_LIST,
    ACTION_READ,
    SUBJECT_DASHBOARD,
    SUBJECT_LOGS,
    SUBJECT_SECTIONS,
    SUBJECT_STUDENTS,
    SUBJECT_SUBJECTS,
} from '@constants';
import { UserRoles } from '@enums';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { User } from '@models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
    AuthService,
    UsersService,
    SnackbarService,
    RouterService,
    PermissionsService,
} from '@services';
import { LoginActions } from '@stores/login';
import { UsersListActions } from '@stores/users';
import { isArray, isFunction } from 'lodash';
import { from, of } from 'rxjs';
import {
    withLatestFrom,
    filter,
    switchMap,
    catchError,
    tap,
    concatMap,
    map,
} from 'rxjs/operators';
import { AuthenticationActions } from '.';
import { AuthenticationReducer, RootState } from '..';

interface ToggleNavigationItem {
    name: string;
    rules: Array<{
        actions: Array<AbilityAction>;
        subject: AbilitySubject;
    }>;
    condition?: (user: User) => boolean; // additional condition option
}

interface RootToggleNavigationItem {
    name: string;
    children?: Array<ToggleNavigationItem>;
    hide?: boolean;
}

@Injectable()
export class AuthenticationEffects {
    constructor(
        private actions$: Actions,
        private store: Store<RootState>,
        private router: Router,
        private authService: AuthService,
        private splashscreenService: FuseSplashScreenService,
        private usersService: UsersService,
        private dialog: MatDialog,
        private snackbarService: SnackbarService,
        private routerService: RouterService,
        private permissionsService: PermissionsService,
        private fuseNavigationService: FuseNavigationService
    ) {}

    // Time-Log Login
    onTimeLogLogin$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(LoginActions.onTimeLogLogin),
            switchMap((action) =>
                this.authService.loginByStudentNumber(action.studentNo).pipe(
                    map((user) =>
                        AuthenticationActions.onAdminLogInSuccess({ user })
                    ),
                    catchError((error) =>
                        of(AuthenticationActions.onAdminLoginFailure({ error }))
                    )
                )
            )
        );
    });

    // Admin Login
    onAdminLogin$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(LoginActions.onLogin),
            switchMap((action) =>
                this.authService.login(action.username, action.password).pipe(
                    map((user) => {
                        return AuthenticationActions.onAdminLogInSuccess({
                            user,
                        });
                    }),
                    catchError((error) =>
                        of(AuthenticationActions.onAdminLoginFailure({ error }))
                    )
                )
            )
        );
    });

    // Load Current User Profile
    loadCurrentUserProfile$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(
                AuthenticationActions.onLoadCurrentUser,
                AuthenticationActions.onAdminLogInSuccess,
                UsersListActions.onUpdateUserSuccess
            ),
            withLatestFrom(
                this.store.select(AuthenticationReducer.selectUserId)
            ),
            filter(([action, id]) => !!id),
            switchMap(([action, id]) => {
                const isLogin =
                    action.type ===
                    AuthenticationActions.onAdminLogInSuccess.type;

                return this.usersService.getUserById(id).pipe(
                    map((user) => {
                        return AuthenticationActions.onLoadCurrentUserSuccess({
                            user,
                            isLogin,
                        });
                    }),
                    catchError((error) =>
                        of(
                            AuthenticationActions.onLoadCurrentUserFailure({
                                error,
                                isLogin,
                            })
                        )
                    )
                );
            })
        );
    });

    // Log Out
    onLogOut$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(
                AuthenticationActions.onLogout,
                AuthenticationActions.onForceLogout
            ),
            switchMap((action) =>
                this.authService.logOut().pipe(
                    map((result) => AuthenticationActions.onLogOutSuccess()),
                    catchError((error) =>
                        of(AuthenticationActions.onLogOutFailure({ error }))
                    )
                )
            )
        );
    });

    navigateToLogInOnLogOutSuccess$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(AuthenticationActions.onLogOutSuccess),
                tap((result) => {
                    this.router.navigate(['auth/admin-login']);
                    this.permissionsService.removeAllAbilities();
                })
            );
        },
        { dispatch: false }
    );

    // Reset Current User Password
    resetCurrentUserPassword$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthenticationActions.onResetCurrentUserPassword),
            withLatestFrom(
                this.store.select(AuthenticationReducer.selectUserId)
            ),
            switchMap(([action, userId]) =>
                from(this.usersService.changeUserPassword(userId)).pipe(
                    map(() => AuthenticationActions.onChangePasswordSuccess()),
                    catchError((error) =>
                        of(
                            AuthenticationActions.onChangePasswordFailure({
                                error,
                            })
                        )
                    )
                )
            )
        );
    });

    // Showing Angular Material Snack Bar
    showErrorSnackBar$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(
                    AuthenticationActions.onAdminLoginFailure,
                    AuthenticationActions.onLogOutFailure,
                    AuthenticationActions.onCurrentSignInUserSessionFailure
                ),
                tap((action) => {
                    this.snackbarService.openError(
                        typeof action.error === 'string'
                            ? action.error
                            : action.error?.message ?? 'Something went wrong.'
                    );
                })
            );
        },
        { dispatch: false }
    );

    // Showing splashscreen
    showSplashscreen$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(LoginActions.onLogInSuccess)
                // tap((action) => this.splashscreenService.show())
            );
        },
        { dispatch: false }
    );

    // Hiding splashscreen
    hideSplashscreen$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(
                    LoginActions.onLogInFailure,
                    AuthenticationActions.onLoadCurrentUserSuccess,
                    AuthenticationActions.onLoadCurrentUserFailure
                ),
                tap((action) => this.splashscreenService.hide())
            );
        },
        { dispatch: false }
    );

    // Update Current User Profile
    updateCurrentUserProfile$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthenticationActions.onUpdateCurrentUser),
            withLatestFrom(
                this.store.select(AuthenticationReducer.selectUserId)
            ),
            switchMap(([action, id]) =>
                this.usersService.editUser(action.partialUser, id).pipe(
                    switchMap(() => this.usersService.getUserById(id)),
                    map((user) =>
                        AuthenticationActions.onUpdateCurrentUserSuccess({
                            user,
                        })
                    ),
                    catchError((error) =>
                        of(
                            AuthenticationActions.onUpdateCurrentUserFailure({
                                error,
                            })
                        )
                    )
                )
            )
        );
    });

    // Update Permission Ability
    updateAbility$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(
                    AuthenticationActions.onLoadCurrentUserSuccess,
                    AuthenticationActions.onUpdateCurrentUserSuccess,
                    AuthenticationActions.onRefreshAbility
                ),
                concatMap((action) =>
                    of(action).pipe(
                        withLatestFrom(
                            this.store.select(
                                AuthenticationReducer.selectCurrentUser
                            )
                        )
                    )
                ),
                tap(([action, user]) => {
                    this.permissionsService.updateAbilityFor(user);
                    this.updateMenuNavigation(user);
                })
            );
        },
        { dispatch: false }
    );

    // Navigate to Landing Page
    navigateToLandingPageAfterLogInAndLoadCurrentUser$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(AuthenticationActions.onLoadCurrentUserSuccess),
                tap((action) => {
                    if (action.isLogin) {
                        this.routerService.navigateToLandingPage(
                            action.user[0]?.role
                        );
                    }
                })
            );
        },
        { dispatch: false }
    );

    private updateMenuNavigation(sessionUser: User): void {
        const navigationItems: Array<RootToggleNavigationItem> = [
            // HOME
            // {
            //     name: 'home',
            //     children: [
            //         {
            //             name: 'dashboard',
            //             rules: [
            //                 {
            //                     actions: [ACTION_READ, ACTION_LIST],
            //                     subject: SUBJECT_DASHBOARD,
            //                 },
            //             ],
            //             condition: (user) => user.role !== UserRoles.STUDENT,
            //         },
            //     ],
            // },
            // Management
            {
                name: 'management',
                children: [
                    {
                        name: 'sections',
                        rules: [
                            {
                                actions: [ACTION_READ, ACTION_LIST],
                                subject: SUBJECT_SECTIONS,
                            },
                        ],
                        condition: (user) => user.role !== UserRoles.STUDENT,
                    },
                    {
                        name: 'students',
                        rules: [
                            {
                                actions: [ACTION_READ, ACTION_LIST],
                                subject: SUBJECT_STUDENTS,
                            },
                        ],
                        condition: (user) => user.role !== UserRoles.STUDENT,
                    },
                    {
                        name: 'subjects',
                        rules: [
                            {
                                actions: [ACTION_READ, ACTION_LIST],
                                subject: SUBJECT_SUBJECTS,
                            },
                        ],
                        condition: (user) => user.role !== UserRoles.STUDENT,
                    },
                ],
            },
            // profile
            {
                name: 'profile',
                children: [
                    {
                        name: 'time-log',
                        rules: [
                            {
                                actions: [ACTION_READ, ACTION_LIST],
                                subject: SUBJECT_LOGS,
                            },
                        ],
                    },
                ],
            },
        ];

        navigationItems.forEach(({ name, children, hide }) => {
            if (hide) {
                this.fuseNavigationService.updateNavigationItem(name, {
                    hidden: true,
                });
                return;
            }

            // toggle root navigation
            this.fuseNavigationService.updateNavigationItem(name, {
                // hide if any of the children is inaccessible
                hidden: !isArray(children)
                    ? true
                    : !children
                          .map(({ name: itemName, rules, condition }) => {
                              // toggle hide/show child navigation
                              // accessible if:
                              //    1. has at least one rule
                              //    2. ability.can(?) CASL
                              //    3. (optional) truthy result of condition
                              const isAccessible =
                                  // rule count check
                                  !!rules.length &&
                                  // ability rule check
                                  rules.every(({ actions, subject }) =>
                                      this.permissionsService.can({
                                          actions,
                                          subject,
                                      })
                                  ) &&
                                  // condition check
                                  (isFunction(condition)
                                      ? condition(sessionUser)
                                      : true);

                              this.fuseNavigationService.updateNavigationItem(
                                  itemName,
                                  {
                                      hidden: !isAccessible,
                                  }
                              );

                              return isAccessible;
                          })
                          .some((result) => result),
            });
        });
    }
}
