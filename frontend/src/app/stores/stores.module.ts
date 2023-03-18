import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { metaReducers, ROOT_REDUCERS } from '@stores/index';

import { AuthenticationModule } from './authentication/authentication.module';
import { CourseListModule } from './courses/course-list.module';
import { LoginModule } from './login/login.module';
import { LogsListModule } from './logs/logs-list.module';
import { SectionListModule } from './sections/section-list.module';
import { SubjectListModule } from './subjects/subject-list.module';
import { TimeLogModule } from './time-log/time-log.module';
import { UserSubjectListModule } from './user-subjects-list/user-subject-list.module';
import { UsersListModule } from './users/users-list.module';

@NgModule({
    imports: [
        CommonModule,
        EffectsModule.forRoot(),
        StoreModule.forRoot(ROOT_REDUCERS, { metaReducers }),
        StoreDevtoolsModule.instrument(),

        AuthenticationModule,
        CourseListModule,
        LoginModule,
        LoginModule,
        LogsListModule,
        SectionListModule,
        SubjectListModule,
        TimeLogModule,
        UsersListModule,
        UserSubjectListModule,
    ],
})
export class StoresModule {}
