import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TimeLogService } from '@services';
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
                return this.timeLogService
                    .postTimeRecord(listState.rfidNo)
                    .pipe(
                        map((timeLog) =>
                            TimeLogActions.onTimeLogSuccess({ timeLog })
                        ),
                        catchError((error) =>
                            of(TimeLogActions.onTimeLogFailure({ error }))
                        )
                    );
            })
        );
    });
}
