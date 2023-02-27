import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LoginReducer } from '..';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(LoginReducer.featureKey, LoginReducer.reducer),
    EffectsModule.forFeature([
    ]),
  ]
})
export class LoginModule { }
