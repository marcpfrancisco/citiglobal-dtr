import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedDialogsModule } from 'src/app/shared/dialogs/shared-dialogs.module';

import { SectionUserListReducer } from '..';
import { SectionUserListEffects } from './section-users-list.effects';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(
            SectionUserListReducer.featureKey,
            SectionUserListReducer.reducer
        ),
        EffectsModule.forFeature([SectionUserListEffects]),
        SharedDialogsModule,
    ],
})
export class SectionUserListModule {}
