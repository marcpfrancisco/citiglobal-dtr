import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
    USER_ARCHIVE_FAIL_MESSAGE,
    USER_ARCHIVE_SUCCESS_MESSAGE,
    USER_CREATE_SUCCESS_MESSAGE,
    USER_UPDATE_SUCCESS_MESSAGE,
} from '@constants';
import { FindAllUsersDto } from '@interfaces';
import { User } from '@models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { FiltersService, SnackbarService, UsersService } from '@services';
import { getParamFromListState } from '@utils';
import { isObjectLike } from 'lodash';
import { of } from 'rxjs';
import {
    catchError,
    concatMap,
    map,
    switchMap,
    tap,
    withLatestFrom,
} from 'rxjs/operators';

import { UsersListActions } from '.';
import { AuthenticationReducer, RootState, UsersListReducer } from '..';
import {
    FiltersDialogComponent,
    FiltersDialogData,
} from '../../shared/dialogs/filters-dialog/filters-dialog.component';
import { AuthenticationActions } from '../authentication';

@Injectable()
export class UsersListEffects {
    constructor(
        private actions$: Actions,
        private store: Store<RootState>,
        private usersService: UsersService,
        private filtersService: FiltersService,
        private dialog: MatDialog,
        private router: Router,
        private snackbarService: SnackbarService
    ) {}

    onLoadUsers$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(
                UsersListActions.onInit,
                UsersListActions.onLoadUsers,
                UsersListActions.onSearch,
                UsersListActions.onApplyFilters,
                UsersListActions.onToggleSort,
                UsersListActions.onDeleteUserSuccess,
                UsersListActions.onUndeleteUserSuccess
            ),
            concatMap((action) =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.select(UsersListReducer.selectState)
                    )
                )
            ),
            switchMap(([action, listState]) => {
                // param
                const param: FindAllUsersDto = getParamFromListState(listState);
                param.search = listState.search;

                // apply not-null filter values
                if (isObjectLike(listState.filters)) {
                    Object.keys(listState.filters).forEach((name) => {
                        // exclude nulls
                        if (listState.filters[name] === null) {
                            return;
                        }

                        param[name] = listState.filters[name];
                    });
                }

                return this.usersService.getUsers(param).pipe(
                    map((result) =>
                        UsersListActions.onLoadUsersSuccess({ result })
                    ),
                    tap(() =>
                        this.store.dispatch(
                            UsersListActions.onCheckForFilters()
                        )
                    ),
                    catchError((error) =>
                        of(UsersListActions.onLoadUsersFailure({ error }))
                    )
                );
            })
        );
    });

    // Show Filters Dialog
    onShowFilters$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(UsersListActions.onShowFilters),
                concatMap((action) =>
                    of(action).pipe(
                        withLatestFrom(
                            this.store.select(UsersListReducer.selectState)
                        )
                    )
                ),
                tap(([action, state]) => {
                    const dialogData: FiltersDialogData = {
                        inputs: this.filtersService.getUsersListFilters(),
                        value: state.filters,
                    };

                    const dialogRef = this.dialog.open(FiltersDialogComponent, {
                        panelClass: FiltersDialogComponent.panelClass,
                        data: dialogData,
                    });

                    dialogRef.afterClosed().subscribe((result) => {
                        if (result) {
                            this.store.dispatch(
                                UsersListActions.onApplyFilters({
                                    filters: result,
                                })
                            );
                        }
                    });
                })
            );
        },
        { dispatch: false }
    );

    onCheckForFilters$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersListActions.onCheckForFilters),
            concatMap((action) =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.select(UsersListReducer.selectState)
                    )
                )
            ),
            map(([action, state]) => {
                const hasFilters = this.filtersService.isEmptyFilterObject(
                    state.filters
                );

                return UsersListActions.onHasFilters({
                    hasFilters: !!hasFilters,
                });
            })
        )
    );

    onCreateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersListActions.onCreateUser),
            switchMap(({ payload }) =>
                this.usersService.createUser(payload).pipe(
                    map((user) =>
                        UsersListActions.onCreateUserSuccess({ user })
                    ),
                    tap(() =>
                        this.snackbarService.openSuccess(
                            USER_CREATE_SUCCESS_MESSAGE
                        )
                    ),
                    catchError((error) =>
                        of(UsersListActions.onCreateUserFailure({ error }))
                    )
                )
            )
        )
    );

    onCreateOrUpdateUserSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(
                    UsersListActions.onCreateUserSuccess,
                    UsersListActions.onUpdateUserSuccess
                ),
                tap(() => {
                    // redirect to User List
                    this.router.navigate(['users']);
                })
            ),
        { dispatch: false }
    );

    onUpdateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersListActions.onUpdateUser),
            concatMap((action) =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.select(
                            AuthenticationReducer.selectCurrentUser
                        )
                    )
                )
            ),
            switchMap(([{ userId, payload }, currentUser]) => {
                return this.usersService.editUser(payload, userId).pipe(
                    map((user) => {
                        // force logout! if update to self has critical updates that disturbs user session.
                        if (this.isRequireLogout(currentUser, user)) {
                            return AuthenticationActions.onForceLogout();
                        }

                        return UsersListActions.onUpdateUserSuccess({ user });
                    }),
                    tap(() =>
                        this.snackbarService.openSuccess(
                            USER_UPDATE_SUCCESS_MESSAGE
                        )
                    ),
                    catchError((error) => {
                        return of(
                            UsersListActions.onUpdateUserFailure({ error })
                        );
                    })
                );
            })
        )
    );

    onDeleteUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersListActions.onDeleteUser),
            switchMap(({ userId }) =>
                this.usersService.deleteUser(String(userId)).pipe(
                    map((result) =>
                        UsersListActions.onDeleteUserSuccess({ result })
                    ),
                    tap(() =>
                        this.snackbarService.openSuccess(
                            USER_ARCHIVE_SUCCESS_MESSAGE
                        )
                    ),
                    catchError((error) =>
                        of(
                            UsersListActions.onDeleteUserFailure({ error })
                        ).pipe(
                            tap(() =>
                                this.snackbarService.openError(
                                    USER_ARCHIVE_FAIL_MESSAGE,
                                    error
                                )
                            )
                        )
                    )
                )
            )
        )
    );

    private isRequireLogout(
        loggedInUser: User,
        { id, role, isActive }: User
    ): boolean {
        // when no user and not in editing self, no need to logout
        if (!loggedInUser?.id || `${loggedInUser?.id}` !== `${id}`) {
            return false;
        }

        // Logout If:
        // 1. there are updates to role
        // 2. there are updates to "active" state
        return role !== loggedInUser.role || isActive !== loggedInUser.isActive;
    }
}
