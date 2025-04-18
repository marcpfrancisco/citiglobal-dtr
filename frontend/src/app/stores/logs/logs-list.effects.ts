import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserRoles } from '@enums';
import { FindAllTimeLogDto } from '@interfaces';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { FiltersService, TimeLogService } from '@services';
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

import { LogsListActions } from '.';
import { LogsListReducer, RootState, UsersListReducer } from '..';
import {
    FiltersDialogComponent,
    FiltersDialogData,
} from '../../shared/dialogs/filters-dialog/filters-dialog.component';

@Injectable()
export class LogsListEffects {
    constructor(
        private actions$: Actions,
        private store: Store<RootState>,
        private timeLogService: TimeLogService,
        private filtersService: FiltersService,
        private dialog: MatDialog
    ) {}

    onLoadTimeLogs$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(
                LogsListActions.onInit,
                LogsListActions.onLoadTimeLogs,
                LogsListActions.onSearch,
                LogsListActions.onApplyFilters,
                LogsListActions.onToggleSort
            ),
            concatMap((action) =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.select(LogsListReducer.selectState)
                    )
                )
            ),
            switchMap(([action, listState]) => {
                // param
                const params: FindAllTimeLogDto =
                    getParamFromListState(listState);
                params.search = listState.search;

                const currentUser = listState.currentUser;
                console.log(currentUser);

                // apply not-null filter values
                if (isObjectLike(listState.filters)) {
                    Object.keys(listState.filters).forEach((name) => {
                        // exclude nulls
                        if (listState.filters[name] === null) {
                            return;
                        }

                        params[name] = listState.filters[name];
                    });
                }

                if (currentUser.role !== UserRoles.SUPERADMIN) {
                    params.userId = currentUser.id;

                    return this.timeLogService
                        .getTimeSheetByUserId(params)
                        .pipe(
                            map((result) =>
                                LogsListActions.onLoadLogsSuccess({ result })
                            ),
                            tap(() =>
                                this.store.dispatch(
                                    LogsListActions.onCheckForFilters()
                                )
                            ),
                            catchError((error) =>
                                of(LogsListActions.onLoadLogsFailure({ error }))
                            )
                        );
                }

                return this.timeLogService.getTimeSheet(params).pipe(
                    map((result) =>
                        LogsListActions.onLoadLogsSuccess({ result })
                    ),
                    tap(() =>
                        this.store.dispatch(LogsListActions.onCheckForFilters())
                    ),
                    catchError((error) =>
                        of(LogsListActions.onLoadLogsFailure({ error }))
                    )
                );
            })
        );
    });

    // Show Filters Dialog
    onShowFilters$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(LogsListActions.onShowFilters),
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
                                LogsListActions.onApplyFilters({
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
            ofType(LogsListActions.onCheckForFilters),
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

                return LogsListActions.onHasFilters({
                    hasFilters: !!hasFilters,
                });
            })
        )
    );
}
