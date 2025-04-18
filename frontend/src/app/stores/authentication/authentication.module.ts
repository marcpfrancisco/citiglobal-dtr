import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthenticationReducer } from '..';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedDialogsModule } from 'src/app/shared/dialogs/shared-dialogs.module';
import { AuthenticationEffects } from './authentication.effects';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(
            AuthenticationReducer.featureKey,
            AuthenticationReducer.reducer
        ),
        SharedDialogsModule,
        MatSnackBarModule,
        EffectsModule.forFeature([AuthenticationEffects]),
    ],
})
export class AuthenticationModule {}
