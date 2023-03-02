import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '@components';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedMaterialModule } from '@material/shared';
import { PipesModule } from '@pipes';

import { StudentListComponent } from './student-list/student-list.component';
import { StudentsRoutingModule } from './students-routing.module';

@NgModule({
    declarations: [StudentListComponent],
    imports: [
        CommonModule,
        StudentsRoutingModule,
        ReactiveFormsModule,
        SharedMaterialModule,
        SharedComponentsModule,
        FuseSharedModule,
        PipesModule,
    ],
})
export class StudentsModule {}
