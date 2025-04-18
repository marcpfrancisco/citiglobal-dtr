import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {
    ACTION_CREATE,
    ACTION_LIST,
    ACTION_READ,
    SUBJECT_USER,
} from '@constants';

import { PermissionsGuard } from '../../guards';
import { UsersListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';

const routes: Routes = [
    {
        path: '',
        component: UsersListComponent,
        data: { actions: [ACTION_LIST], subject: SUBJECT_USER },
        canActivate: [PermissionsGuard],
    },
    {
        path: 'create',
        component: UserEditComponent,
        data: { actions: [ACTION_CREATE], subject: SUBJECT_USER },
        canActivate: [PermissionsGuard],
    },
    {
        path: 'create/:sectionId',
        component: UserEditComponent,
        data: { actions: [ACTION_CREATE], subject: SUBJECT_USER },
        canActivate: [PermissionsGuard],
    },
    {
        path: 'edit/:userId',
        component: UserEditComponent,
        data: { actions: [ACTION_READ], subject: SUBJECT_USER },
        canActivate: [PermissionsGuard],
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class UsersRoutingModule {}
