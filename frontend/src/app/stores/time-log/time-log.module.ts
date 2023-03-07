import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TimeLogReducer } from '..';
import { SharedDialogsModule } from '../../shared/dialogs/shared-dialogs.module';
import { TimeLogEffects } from './time-log.effects';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(
            TimeLogReducer.featureKey,
            TimeLogReducer.reducer
        ),
        EffectsModule.forFeature([TimeLogEffects]),
        SharedDialogsModule,
    ],
})
export class TimeLogModule {}
