import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '@components';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedMaterialModule } from '@material/shared';
import { PipesModule } from '@pipes';

import { SectionListComponent } from './section-list/section-list.component';
import { SectionsRoutingModule } from './sections-routing.module';

@NgModule({
    declarations: [SectionListComponent],
    imports: [
        CommonModule,
        SectionsRoutingModule,
        ReactiveFormsModule,
        SharedMaterialModule,
        SharedComponentsModule,
        FuseSharedModule,
        PipesModule,
    ],
})
export class SectionsModule {}
