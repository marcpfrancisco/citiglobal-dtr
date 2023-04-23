import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SECTION_UNASSIGN_USER_SUCCESS_MESSAGE } from '@constants';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SectionsService, SnackbarService } from '@services';
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

import { SectionUserListActions } from '.';
import { RootState, SectionUserListReducer } from '..';
import { FindAllSectionUsersDto } from '@interfaces';
import { getParamFromListState } from '@utils';

@Injectable()
export class SectionUserListEffects {
    constructor(
        private actions$: Actions,
        private store: Store<RootState>,
        private sectionService: SectionsService,
        private snackbarService: SnackbarService,
        private dialog: MatDialog
    ) {}

    onLoadUserSubjects$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(
                SectionUserListActions.onInit,
                SectionUserListActions.onLoadSectionUsers,
                SectionUserListActions.onAddSectionUsersSuccess,
                SectionUserListActions.onRemoveSectionUsersSuccess,
                SectionUserListActions.onToggleSort
            ),
            concatMap((action) =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.select(SectionUserListReducer.selectState)
                    )
                )
            ),
            switchMap(([action, listState]) => {
                const param: FindAllSectionUsersDto =
                    getParamFromListState(listState);

                param.sectionId = listState.sectionId;

                return this.sectionService.getSectionUsers(param).pipe(
                    map((result) =>
                        SectionUserListActions.onLoadSectionUsersSuccess({
                            result,
                        })
                    ),
                    catchError((error) =>
                        of(
                            SectionUserListActions.onLoadSectionUsersFailure({
                                error,
                            })
                        )
                    )
                );
            })
        );
    });

    onRemoveSectionUser$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(SectionUserListActions.onRemoveSectionUser),
            concatMap((action) =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.select(SectionUserListReducer.selectState)
                    )
                )
            ),
            switchMap(([action, listState]) => {
                return this.sectionService
                    .deleteUserFromSetion(action?.userId)
                    .pipe(
                        map(() =>
                            SectionUserListActions.onRemoveSectionUsersSuccess({
                                id: action?.userId,
                            })
                        ),
                        tap(() =>
                            this.snackbarService.openSuccess(
                                SECTION_UNASSIGN_USER_SUCCESS_MESSAGE
                            )
                        ),
                        catchError((error) =>
                            of(
                                SectionUserListActions.onRemoveSectionUsersFailure(
                                    { error }
                                )
                            )
                        )
                    );
            })
        );
    });

    onRemoveSectionUserConfirmation$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(SectionUserListActions.onRemoveSectionUserConfirmation),
                tap((action) => {
                    const dialogData: AlertDialogData = {
                        title: 'Remove Assigned User',
                        message: 'Are you sure you want to remove user?',
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
                                SectionUserListActions.onRemoveSectionUser({
                                    userId: action?.userId,
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
