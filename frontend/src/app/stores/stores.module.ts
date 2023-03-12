import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { metaReducers, ROOT_REDUCERS } from '@stores/index';

import { AuthenticationModule } from './authentication/authentication.module';
import { LoginModule } from './login/login.module';
import { LogsListModule } from './logs/logs-list.module';
import { SectionListModule } from './sections/section-list.module';
import { SubjectListModule } from './subjects/subject-list.module';
import { TimeLogModule } from './time-log/time-log.module';
import { UsersListModule } from './users/users-list.module';

@NgModule({
    imports: [
        CommonModule,
        EffectsModule.forRoot(),
        StoreModule.forRoot(ROOT_REDUCERS, { metaReducers }),
        StoreDevtoolsModule.instrument(),

        AuthenticationModule,
        LoginModule,
        LoginModule,
        LogsListModule,
        TimeLogModule,
        UsersListModule,
        SectionListModule,
        SubjectListModule,
    ],
})
export class StoresModule {}
