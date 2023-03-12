import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { FiltersService, SectionsService, SnackbarService } from '@services';
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
import {
    FiltersDialogComponent,
    FiltersDialogData,
} from 'src/app/shared/dialogs/filters-dialog/filters-dialog.component';
import { FindAllSectionsDto } from 'src/app/shared/interfaces/section/find-all-sections-dto.interface';
import { SectionListActions } from '.';
import { RootState, SectionListReducer } from '..';

@Injectable()
export class SectionListEffects {
    constructor(
        private actions$: Actions,
        private store: Store<RootState>,
        private sectionsService: SectionsService,
        private filtersService: FiltersService,
        private dialog: MatDialog,
        private router: Router,
        private snackbarService: SnackbarService
    ) {}

    onLoadSections$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(
                SectionListActions.onInit,
                SectionListActions.onLoadSections,
                SectionListActions.onSearch,
                SectionListActions.onApplyFilters,
                SectionListActions.onToggleSort
            ),
            concatMap((action) =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.select(SectionListReducer.selectState)
                    )
                )
            ),
            switchMap(([action, listState]) => {
                // param
                const param: FindAllSectionsDto =
                    getParamFromListState(listState);
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

                return this.sectionsService.getSections(param).pipe(
                    map((result) =>
                        SectionListActions.onLoadSectionsSuccess({ result })
                    ),
                    tap(() =>
                        this.store.dispatch(
                            SectionListActions.onCheckForFilters()
                        )
                    ),
                    catchError((error) =>
                        of(SectionListActions.onLoadSectionsFailure({ error }))
                    )
                );
            })
        );
    });

    // Show Filters Dialog
    onShowFilters$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(SectionListActions.onShowFilters),
                concatMap((action) =>
                    of(action).pipe(
                        withLatestFrom(
                            this.store.select(SectionListReducer.selectState)
                        )
                    )
                ),
                tap(([action, state]) => {
                    const dialogData: FiltersDialogData = {
                        inputs: this.filtersService.getSectionListFilters(),
                        value: state.filters,
                    };

                    const dialogRef = this.dialog.open(FiltersDialogComponent, {
                        panelClass: FiltersDialogComponent.panelClass,
                        data: dialogData,
                    });

                    dialogRef.afterClosed().subscribe((result) => {
                        if (result) {
                            this.store.dispatch(
                                SectionListActions.onApplyFilters({
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
            ofType(SectionListActions.onCheckForFilters),
            concatMap((action) =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.select(SectionListReducer.selectState)
                    )
                )
            ),
            map(([action, state]) => {
                const hasFilters = this.filtersService.isEmptyFilterObject(
                    state.filters
                );

                return SectionListActions.onHasFilters({
                    hasFilters: !!hasFilters,
                });
            })
        )
    );
}
