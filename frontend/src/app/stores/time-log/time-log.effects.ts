import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SnackbarService, TimeLogService } from '@services';
import { of } from 'rxjs';
import {
    catchError,
    concatMap,
    map,
    switchMap,
    tap,
    withLatestFrom,
} from 'rxjs/operators';
import { UserIdentifcationCardComponent } from 'src/app/main/users/user-identification-card/user-identification-card.component';

import { TimeLogActions } from '.';
import { RootState, TimeLogReducer } from '..';

@Injectable()
export class TimeLogEffects {
    constructor(
        private actions$: Actions,
        private timeLogService: TimeLogService,
        private store: Store<RootState>,
        private dialog: MatDialog,
        private snackbarService: SnackbarService
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
                        tap(() =>
                            this.store.dispatch(
                                TimeLogActions.onShowTimeLogID()
                            )
                        ),
                        catchError((error) =>
                            of(TimeLogActions.onTimeLogFailure({ error }))
                        )
                    );
            })
        );
    });

    onShowTimeLogID$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(TimeLogActions.onShowTimeLogID),
                concatMap((action) =>
                    of(action).pipe(
                        withLatestFrom(
                            this.store.select(TimeLogReducer.selectState)
                        )
                    )
                ),
                tap(([action, state]) => {
                    const dialogRef = this.dialog.open(
                        UserIdentifcationCardComponent,
                        {
                            panelClass:
                                UserIdentifcationCardComponent.panelClass,
                            data: state?.user,
                        }
                    );

                    // setTimeout(() => {
                    //     dialogRef.close();
                    // }, 1000);
                })
            );
        },
        { dispatch: false }
    );
}
