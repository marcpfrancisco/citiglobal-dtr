import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SectionListEffects } from './section-list.effects';
import { SectionListReducer } from '..';
import { SharedDialogsModule } from '../../shared/dialogs/shared-dialogs.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(
            SectionListReducer.featureKey,
            SectionListReducer.reducer
        ),
        EffectsModule.forFeature([SectionListEffects]),
        SharedDialogsModule,
    ],
})
export class SectionListModule {}
