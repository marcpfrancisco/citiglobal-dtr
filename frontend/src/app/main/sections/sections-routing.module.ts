import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ACTION_CREATE, ACTION_READ, SUBJECT_SECTIONS } from '@constants';
import { PermissionsGuard } from 'src/app/guards';

import { SectionEditComponent } from './section-edit/section-edit.component';
import { SectionListComponent } from './section-list/section-list.component';

const routes: Routes = [
    { path: '', component: SectionListComponent },
    {
        path: 'create',
        component: SectionEditComponent,
        data: { actions: [ACTION_CREATE], subject: SUBJECT_SECTIONS },
        canActivate: [PermissionsGuard],
    },
    {
        path: 'edit/:sectionId',
        component: SectionEditComponent,
        data: { actions: [ACTION_READ], subject: SUBJECT_SECTIONS },
        canActivate: [PermissionsGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SectionsRoutingModule {}
