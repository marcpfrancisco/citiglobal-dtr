import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TimeLogService } from '@services';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { TimeLogActions } from '.';

@Injectable()
export class TimeLogEffects {
    constructor(
        private actions$: Actions,
        private timeLogService: TimeLogService
    ) {}

    onLoadTimeLog$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TimeLogActions.onSearchRFID),
            switchMap((action) => {
                return this.timeLogService.postTimeRecord(action.rfidNo).pipe(
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
