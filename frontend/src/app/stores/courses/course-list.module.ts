import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CourseListReducer } from '..';
import { SharedDialogsModule } from '../../shared/dialogs/shared-dialogs.module';
import { CourseListEffects } from './course-list.effects';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(
            CourseListReducer.featureKey,
            CourseListReducer.reducer
        ),
        EffectsModule.forFeature([CourseListEffects]),
        SharedDialogsModule,
    ],
})
export class CourseListModule {}
