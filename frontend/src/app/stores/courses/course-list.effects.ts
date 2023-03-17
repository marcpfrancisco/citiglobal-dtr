import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CourseService, FiltersService, SnackbarService } from '@services';
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
import { FindAllCoursesDto } from 'src/app/shared/interfaces/course/find-all-courses-dto.interface';
import { CourseListActions } from '.';
import { CourseListReducer, RootState } from '..';

@Injectable()
export class CourseListEffects {
    constructor(
        private actions$: Actions,
        private store: Store<RootState>,
        private courseService: CourseService,
        private filtersService: FiltersService,
        private dialog: MatDialog,
        private router: Router,
        private snackbarService: SnackbarService
    ) {}

    onLoadCourses$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CourseListActions.onInit, CourseListActions.onLoadCourses),
            concatMap((action) =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.select(CourseListReducer.selectState)
                    )
                )
            ),
            switchMap(([action, listState]) => {
                // param
                const param: FindAllCoursesDto =
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

                return this.courseService.getCourses(param).pipe(
                    map((result) =>
                        CourseListActions.onLoadCoursesSuccess({ result })
                    ),
                    catchError((error) =>
                        of(CourseListActions.onLoadCoursesFailure({ error }))
                    )
                );
            })
        );
    });
}
