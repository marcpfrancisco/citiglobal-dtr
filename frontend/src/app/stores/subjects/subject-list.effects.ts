import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FindAllSubjectsDto } from '@interfaces';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { FiltersService, SnackbarService, SubjectsService } from '@services';
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

import { SubjectListActions } from '.';
import { RootState, SectionListReducer, SubjectListReducer } from '..';

@Injectable()
export class SubjectListeffects {
    constructor(
        private actions$: Actions,
        private store: Store<RootState>,
        private subjectsService: SubjectsService,
        private filtersService: FiltersService,
        private dialog: MatDialog,
        private router: Router,
        private snackbarService: SnackbarService
    ) {}

    onLoadSubjects$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(
                SubjectListActions.onInit,
                SubjectListActions.onLoadSubject,
                SubjectListActions.onSearch,
                SubjectListActions.onApplyFilters,
                SubjectListActions.onToggleSort
            ),
            concatMap((action) =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.select(SubjectListReducer.selectState)
                    )
                )
            ),
            switchMap(([action, listState]) => {
                // param
                const param: FindAllSubjectsDto =
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

                return this.subjectsService.getSubjects(param).pipe(
                    map((result) =>
                        SubjectListActions.onLoadSubjectsSuccess({ result })
                    ),
                    tap(() =>
                        this.store.dispatch(
                            SubjectListActions.onCheckForFilters()
                        )
                    ),
                    catchError((error) =>
                        of(SubjectListActions.onLoadSubjectsFailure({ error }))
                    )
                );
            })
        );
    });

    // Show Filters Dialog
    onShowFilters$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(SubjectListActions.onShowFilters),
                concatMap((action) =>
                    of(action).pipe(
                        withLatestFrom(
                            this.store.select(SectionListReducer.selectState)
                        )
                    )
                ),
                tap(([action, state]) => {
                    const dialogData: FiltersDialogData = {
                        inputs: this.filtersService.getSubjectListFilters(),
                        value: state.filters,
                    };

                    const dialogRef = this.dialog.open(FiltersDialogComponent, {
                        panelClass: FiltersDialogComponent.panelClass,
                        data: dialogData,
                    });

                    dialogRef.afterClosed().subscribe((result) => {
                        if (result) {
                            this.store.dispatch(
                                SubjectListActions.onApplyFilters({
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
            ofType(SubjectListActions.onCheckForFilters),
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

                return SubjectListActions.onHasFilters({
                    hasFilters: !!hasFilters,
                });
            })
        )
    );
}
