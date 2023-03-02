import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedMaterialModule } from '@material/shared';

import { PipesModule } from '../pipes/pipes.module';
import { HeaderComponent } from './header/header.component';
import { NumberRangeFieldModule } from './number-range-field/number-range-field.module';
import { SnackbarMultilineModule } from './snackbar-multiline';
import { StudentCardComponent } from './student-card/student-card.component';

const COMPONENTS = [HeaderComponent, StudentCardComponent];

const MODULES = [
    NumberRangeFieldModule,
    SnackbarMultilineModule,
    SharedMaterialModule,
    PipesModule,
];

@NgModule({
    declarations: COMPONENTS,
    exports: [...COMPONENTS, ...MODULES],
    imports: [...MODULES, CommonModule],
})
export class SharedComponentsModule {}
