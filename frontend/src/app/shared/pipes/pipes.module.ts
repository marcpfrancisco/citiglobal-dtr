import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { PhoneNumberFormat } from 'google-libphonenumber';

import { AblePipe } from './able.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { DateTimeFormatPipe } from './date-time-format.pipe';
import { ListStateMatSortPipe } from './list-state-mat-sort.pipe';
import { MomentizePipe } from './momentize.pipe';
import { PhoneNumberFormatPipe } from './phone-number-format.pipe';
import { PhoneNumberUriPipe } from './phone-number-uri.pipe';
import { TimeDifferencePipe } from './time-difference.pipe';
import { TitleCasePipe } from './title-case.pipe';
import { UserFullNamePipe } from './user-fullname.pipe';
import { UserRolesPipe } from './user-roles.pipe';

const ALL_PIPES = [
    AblePipe,
    DateFormatPipe,
    ListStateMatSortPipe,
    MomentizePipe,
    PhoneNumberFormatPipe,
    PhoneNumberUriPipe,
    TitleCasePipe,
    UserRolesPipe,
    UserFullNamePipe,
    TimeDifferencePipe,
    DateTimeFormatPipe,
];

@NgModule({
    declarations: ALL_PIPES,
    exports: ALL_PIPES,
    imports: [CommonModule],
    providers: [
        AblePipe,
        DatePipe,
        DateFormatPipe,
        ListStateMatSortPipe,
        MomentizePipe,
        PhoneNumberFormatPipe,
        PhoneNumberUriPipe,
        TitleCasePipe,
        UserRolesPipe,
        UserFullNamePipe,
        TimeDifferencePipe,
        DateTimeFormatPipe,
    ],
})
export class PipesModule {}
