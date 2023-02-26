import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from '@material/shared';
import { TranslateModule } from '@ngx-translate/core';

const COMPONENTS = [];

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
    ],
})
export class SharedComponentsModule {}
