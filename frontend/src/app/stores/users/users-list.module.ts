import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UsersListEffects } from './users-list.effects';
import { UsersListReducer } from '..';
import { SharedDialogsModule } from '../../shared/dialogs/shared-dialogs.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(UsersListReducer.featureKey, UsersListReducer.reducer),
    EffectsModule.forFeature([
      UsersListEffects,
    ]),
    SharedDialogsModule,
  ]
})
export class UsersListModule { }
