import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedDialogsModule } from 'src/app/shared/dialogs/shared-dialogs.module';
import { UserSubjectListReducer } from '..';
import { UserSubjectListEffects } from './user-subject-list.effects';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(
            UserSubjectListReducer.featureKey,
            UserSubjectListReducer.reducer
        ),
        EffectsModule.forFeature([UserSubjectListEffects]),
        SharedDialogsModule,
    ],
})
export class UserSubjectListModule {}
