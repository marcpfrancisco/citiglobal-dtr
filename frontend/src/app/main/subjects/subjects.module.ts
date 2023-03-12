import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '@components';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedMaterialModule } from '@material/shared';
import { PipesModule } from '@pipes';
import { SubjectEditComponent } from './subject-edit/subject-edit.component';

import { SubjectListComponent } from './subject-list/subject-list.component';
import { SubjectsRoutingModule } from './subjects-routing.module';

@NgModule({
    declarations: [SubjectListComponent, SubjectEditComponent],
    imports: [
        CommonModule,
        SubjectsRoutingModule,
        ReactiveFormsModule,
        SharedMaterialModule,
        SharedComponentsModule,
        FuseSharedModule,
        PipesModule,
    ],
})
export class SubjectsModule {}
