import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LogsListEffects } from './logs-list.effects';
import { SharedDialogsModule } from '../../shared/dialogs/shared-dialogs.module';
import { LogsListReducer } from '..';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(
            LogsListReducer.featureKey,
            LogsListReducer.reducer
        ),
        EffectsModule.forFeature([LogsListEffects]),
        SharedDialogsModule,
    ],
})
export class LogsListModule {}
