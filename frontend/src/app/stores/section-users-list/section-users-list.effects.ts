import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SectionsService, SnackbarService, UsersService } from '@services';
import { RootState, SectionUserListReducer } from '..';
import { FindAllUsersDto } from '@interfaces';
import { FindAllSectionsDto } from 'src/app/shared/interfaces/section/find-all-sections-dto.interface';
import { getParamFromListState } from '@utils';
import {
    catchError,
    concatMap,
    map,
    switchMap,
    withLatestFrom,
} from 'rxjs/operators';
import { SectionUserListActions } from '.';
import { of } from 'rxjs';

@Injectable()
export class SectionUserListEffects {
    constructor(
        private actions$: Actions,
        private store: Store<RootState>,
        private sectionService: SectionsService,
        private usersService: UsersService,
        private dialog: MatDialog,
        private snackbarService: SnackbarService
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
                const param: FindAllUsersDto = getParamFromListState(listState);

                param.sectionId = listState.sectionId;

                return this.usersService.getUsers(param).pipe(
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
}
