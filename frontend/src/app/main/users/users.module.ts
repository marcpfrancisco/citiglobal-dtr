import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { SharedComponentsModule } from '@components';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedMaterialModule } from '@material/shared';
import { PipesModule } from '@pipes';
import { UserAssignSubjectComponent } from './user-assign-subject/user-assign-subject.component';
import { UserEditComponent } from './user-edit/user-edit.component';

import { UsersListComponent } from './user-list/user-list.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
    declarations: [
        UsersListComponent,
        UserEditComponent,
        UserAssignSubjectComponent,
    ],
    imports: [
        CommonModule,
        UsersRoutingModule,
        SharedMaterialModule,
        SharedComponentsModule,
        FuseSharedModule,
        MatMenuModule,
        PipesModule,
    ],
    entryComponents: [UserAssignSubjectComponent],
    exports: [UserAssignSubjectComponent],
})
export class UsersModule {}
