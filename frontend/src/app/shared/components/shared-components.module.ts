import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedMaterialModule } from '@material/shared';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

import { CleanrInputValueDirective } from '../directives/clear-input-value.directive';
import { FocusElementDirective } from '../directives/focus-element.directive';
import { ObserveVisibilityDirective } from '../directives/observe-visibility.directive';
import { PipesModule } from '../pipes/pipes.module';
import { FilterListComponent } from './filter-list/filter-list.component';
import { HeaderComponent } from './header/header.component';
import { NumberRangeFieldModule } from './number-range-field/number-range-field.module';
import { SearchComponent } from './search/search.component';
import { SnackbarMultilineModule } from './snackbar-multiline';
import { StudentCardComponent } from './student-card/student-card.component';
import { TimeLogFieldComponent } from './time-log-field/time-log-field.component';

const COMPONENTS = [
    HeaderComponent,
    StudentCardComponent,
    SearchComponent,
    FilterListComponent,
    TimeLogFieldComponent,

    // directives
    ObserveVisibilityDirective,
    FocusElementDirective,
    CleanrInputValueDirective,
];

const MODULES = [
    NumberRangeFieldModule,
    SnackbarMultilineModule,
    SharedMaterialModule,
    PipesModule,
    NgxMatDatetimePickerModule,
];

@NgModule({
    declarations: COMPONENTS,
    exports: [...COMPONENTS, ...MODULES, NgxMatTimepickerModule],
    imports: [
        ...MODULES,
        CommonModule,
        NgxMatTimepickerModule.setLocale('en-PH'),
    ],
})
export class SharedComponentsModule {}
