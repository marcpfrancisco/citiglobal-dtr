import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from '@material/shared';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from './header/header.component';
import { NumberRangeFieldModule } from './number-range-field/number-range-field.module';
import { SnackbarMultilineModule } from './snackbar-multiline';
import { StudentCardComponent } from './student-card/student-card.component';

const COMPONENTS = [HeaderComponent, StudentCardComponent];

@NgModule({
    declarations: COMPONENTS,
    exports: COMPONENTS,
    imports: [
        CommonModule,
        TranslateModule,
        SharedMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        HttpClientModule,
        HttpClientJsonpModule,

        NumberRangeFieldModule,
        SnackbarMultilineModule,
    ],
})
export class SharedComponentsModule {}
