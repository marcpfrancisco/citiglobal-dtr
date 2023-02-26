import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ROOT_REDUCERS, metaReducers } from '@stores/index';
import { AuthenticationModule } from './authentication/authentication.module';

@NgModule({
    imports: [
        CommonModule,
        EffectsModule.forRoot(),
        StoreModule.forRoot(ROOT_REDUCERS, { metaReducers }),
        StoreDevtoolsModule.instrument(),

        AuthenticationModule,
    ],
})
export class StoresModule {}
