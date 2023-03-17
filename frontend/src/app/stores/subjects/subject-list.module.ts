import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SubjectListReducer } from '..';
import { SharedDialogsModule } from '../../shared/dialogs/shared-dialogs.module';
import { SubjectListeffects } from './subject-list.effects';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(
            SubjectListReducer.featureKey,
            SubjectListReducer.reducer
        ),
        EffectsModule.forFeature([SubjectListeffects]),
        SharedDialogsModule,
    ],
})
export class SubjectListModule {}
