import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { USER_ASSIGN_SUBJECT_SUCCESS_MESSAGE } from '@constants';
import { FindAllSubjectsDto } from '@interfaces';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SnackbarService, SubjectsService, UsersService } from '@services';
import { getParamFromListState } from '@utils';
import { of } from 'rxjs';
import {
    catchError,
    concatMap,
    map,
    switchMap,
    tap,
    withLatestFrom,
} from 'rxjs/operators';
import {
    AlertComponent,
    AlertDialogData,
    ButtonTypes,
} from 'src/app/shared/dialogs/alert/alert.component';
import { UserSubjectListActions } from '.';
import { RootState, UserSubjectListReducer } from '..';

@Injectable()
export class UserSubjectListEffects {
    constructor(
        private actions$: Actions,
        private store: Store<RootState>,
        private subjectsService: SubjectsService,
        private usersService: UsersService,
        private dialog: MatDialog,
        private snackbarService: SnackbarService
    ) {}

    onLoadUserSubjects$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(
                UserSubjectListActions.onInit,
                UserSubjectListActions.onLoadUsersSubjects,
                UserSubjectListActions.onAddUserSubjectSuccess,
                UserSubjectListActions.onRemoveUserSubjectSuccess,
                UserSubjectListActions.onToggleSort
            ),
            concatMap((action) =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.select(UserSubjectListReducer.selectState)
                    )
                )
            ),
            switchMap(([action, listState]) => {
                const param: FindAllSubjectsDto =
                    getParamFromListState(listState);

                param.userId = listState.userId;

                return this.subjectsService.getSubjects(param).pipe(
                    map((result) =>
                        UserSubjectListActions.onLoadUsersSubjectstsSuccess({
                            result,
                        })
                    ),
                    catchError((error) =>
                        of(
                            UserSubjectListActions.onLoadUsersSubjectsFailure({
                                error,
                            })
                        )
                    )
                );
            })
        );
    });

    onAddUserSubject$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserSubjectListActions.onAddUserSubject),
            concatMap((action) =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.select(UserSubjectListReducer.selectState)
                    )
                )
            ),
            switchMap(([{ subjectId }, { userId }]) => {
                return this.usersService
                    .addSubjectToUser(userId, subjectId)
                    .pipe(
                        map((user) => {
                            return UserSubjectListActions.onAddUserSubjectSuccess(
                                {
                                    user,
                                }
                            );
                        }),
                        tap(() =>
                            this.snackbarService.openSuccess(
                                USER_ASSIGN_SUBJECT_SUCCESS_MESSAGE
                            )
                        ),
                        catchError((httpError) =>
                            of(
                                UserSubjectListActions.onAddUserSubjectFailure({
                                    error: httpError.error,
                                })
                            )
                        )
                    );
            })
        );
    });

    onRemoveUserSubject$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserSubjectListActions.onRemoveUserSubject),
            concatMap((action) =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.select(UserSubjectListReducer.selectState)
                    )
                )
            ),
            switchMap(([action, listState]) => {
                return this.usersService
                    .deleteSubjectFromUser(
                        String(listState.userId),
                        String(action?.subjectId)
                    )
                    .pipe(
                        map(() =>
                            UserSubjectListActions.onRemoveUserSubjectSuccess({
                                id: action?.subjectId,
                            })
                        ),
                        tap(() =>
                            this.snackbarService.openSuccess(
                                USER_ASSIGN_SUBJECT_SUCCESS_MESSAGE
                            )
                        ),
                        catchError((error) =>
                            of(
                                UserSubjectListActions.onRemoveUserSubjectFailure(
                                    { error }
                                )
                            )
                        )
                    );
            })
        );
    });

    onRemoveUserSubjectConfirmation$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(UserSubjectListActions.onRemoveUserSubjectConfirmation),
                tap((action) => {
                    const dialogData: AlertDialogData = {
                        title: 'Remove Assigned Subject',
                        message: 'Are you sure you want to remove subject?',
                        buttons: [
                            { title: 'CANCEL', type: ButtonTypes.CANCEL },
                            { title: 'REMOVE', type: ButtonTypes.CONFIRM },
                        ],
                    };
                    const dialogRef = this.dialog.open(AlertComponent, {
                        disableClose: true,
                        minWidth: 280,
                        data: dialogData,
                    });
                    dialogRef.afterClosed().subscribe((result) => {
                        if (result === ButtonTypes.CONFIRM) {
                            this.store.dispatch(
                                UserSubjectListActions.onRemoveUserSubject({
                                    subjectId: action?.subjectId,
                                })
                            );
                        }
                    });
                })
            );
        },
        { dispatch: false }
    );
}
