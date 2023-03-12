import { Injectable } from '@angular/core';
import { FindAllTimeLogDto } from '@interfaces';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TimeLogService } from '@services';
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

import { TimeLogActions } from '.';
import { RootState, TimeLogReducer } from '..';

@Injectable()
export class TimeLogEffects {
    constructor(
        private actions$: Actions,
        private timeLogService: TimeLogService,
        private store: Store<RootState>
    ) {}

    onLoadTimeLog$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TimeLogActions.onSearchRFID),
            concatMap((action) =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.select(TimeLogReducer.selectState)
                    )
                )
            ),
            switchMap(([action, listState]) => {
                // param
                const param: FindAllTimeLogDto =
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

                return this.timeLogService
                    .postTimeRecord(listState.timeLog.rfidNo)
                    .pipe(
                        map((result) =>
                            TimeLogActions.onTimeLogSuccess({ result })
                        ),
                        tap(() => TimeLogActions.onClearTimeLogField),
                        catchError((error) =>
                            of(TimeLogActions.onTimeLogFailure({ error }))
                        )
                    );
            })
        );
    });
}
