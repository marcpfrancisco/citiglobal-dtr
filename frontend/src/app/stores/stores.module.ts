import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ROOT_REDUCERS } from '@stores/index';
import { AuthenticationModule } from './authentication/authentication.module';
import { LoginModule } from './login/login.module';

@NgModule({
    imports: [
        CommonModule,
        EffectsModule.forRoot(),
        StoreModule.forRoot(ROOT_REDUCERS),
        StoreDevtoolsModule.instrument(),

        AuthenticationModule,
        LoginModule,
    ],
})
export class StoresModule {}
