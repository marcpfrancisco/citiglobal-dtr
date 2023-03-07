import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from '../material/shared-material.module';
import { AlertComponent } from './alert/alert.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { MultiSelectFiltersDialogComponent } from './multi-select-filters-dialog/multi-select-filters-dialog.component';
import { SharedComponentsModule } from '../components/shared-components.module';

const COMPONENTS = [
    AlertComponent,
    FiltersDialogComponent,
    MultiSelectFiltersDialogComponent,
];

@NgModule({
    declarations: COMPONENTS,
    exports: [...COMPONENTS, MatDialogModule],
    imports: [
        CommonModule,
        FuseSharedModule,
        SharedMaterialModule,
        MatDialogModule,
        SharedComponentsModule,
    ],
})
export class SharedDialogsModule {}
