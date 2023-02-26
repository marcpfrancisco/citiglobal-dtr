import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {
    ACTION_CREATE,
    ACTION_LIST,
    ACTION_READ,
    SUBJECT_USER,
} from '@constants';

// import { UsersListComponent } from './users-list/users-list.component';
// import { UsersEditComponent } from './users-edit/users-edit.component';
import { PermissionsGuard } from '../../guards';

const routes: Routes = [
    // {
    //   path: '',
    //   component: UsersListComponent,
    //   data: { actions: [ACTION_LIST], subject: SUBJECT_USER },
    //   canActivate: [PermissionsGuard],
    // },
    // {
    //   path: 'create',
    //   component: UsersEditComponent,
    //   data: { actions: [ACTION_CREATE], subject: SUBJECT_USER },
    //   canActivate: [PermissionsGuard],
    // },
    // {
    //   path: 'edit/:userId',
    //   component: UsersEditComponent,
    //   data: { actions: [ACTION_READ], subject: SUBJECT_USER },
    //   canActivate: [PermissionsGuard],
    // },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class UsersRoutingModule {}
