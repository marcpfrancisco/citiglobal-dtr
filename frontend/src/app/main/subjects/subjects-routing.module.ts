import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ACTION_CREATE, ACTION_READ, SUBJECT_SUBJECTS } from '@constants';
import { PermissionsGuard } from 'src/app/guards';
import { SubjectEditComponent } from './subject-edit/subject-edit.component';
import { SubjectListComponent } from './subject-list/subject-list.component';

const routes: Routes = [
    { path: '', component: SubjectListComponent },
    {
        path: 'create',
        component: SubjectEditComponent,
        data: { actions: [ACTION_CREATE], subject: SUBJECT_SUBJECTS },
        canActivate: [PermissionsGuard],
    },
    {
        path: 'edit/:subjectId',
        component: SubjectEditComponent,
        data: { actions: [ACTION_READ], subject: SUBJECT_SUBJECTS },
        canActivate: [PermissionsGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SubjectsRoutingModule {}
