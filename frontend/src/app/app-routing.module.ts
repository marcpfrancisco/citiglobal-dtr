import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, PermissionsGuard } from './guards';
import {
    ACTION_LIST,
    ACTION_READ,
    SUBJECT_DASHBOARD,
    SUBJECT_SECTIONS,
    SUBJECT_STUDENTS,
    SUBJECT_SUBJECTS,
    SUBJECT_LOGS,
    SUBJECT_USER,
} from '@constants';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('./main/authentication/authentication.module').then(
                (m) => m.AuthenticationModule
            ),
    },

    {
        path: 'dashboard',
        loadChildren: () =>
            import('./main/dashboard/dashboard.module').then(
                (m) => m.DashboardModule
            ),
        data: {
            actions: [ACTION_LIST, ACTION_READ],
            subject: SUBJECT_DASHBOARD,
        },
        // canActivate: [AuthGuard, PermissionsGuard],
    },

    {
        path: 'sections',
        loadChildren: () =>
            import('./main/sections/sections.module').then(
                (m) => m.SectionsModule
            ),
        data: {
            actions: [ACTION_LIST, ACTION_READ],
            subject: SUBJECT_SECTIONS,
        },
        // canActivate: [AuthGuard, PermissionsGuard],
    },

    {
        path: 'students',
        loadChildren: () =>
            import('./main/students/students.module').then(
                (m) => m.StudentsModule
            ),
        data: {
            actions: [ACTION_LIST, ACTION_READ],
            subject: SUBJECT_STUDENTS,
        },
        canActivate: [AuthGuard, PermissionsGuard],
    },

    {
        path: 'subjects',
        loadChildren: () =>
            import('./main/subjects/subjects.module').then(
                (m) => m.SubjectsModule
            ),
        data: {
            actions: [ACTION_LIST, ACTION_READ],
            subject: SUBJECT_SUBJECTS,
        },
        canActivate: [AuthGuard, PermissionsGuard],
    },

    {
        path: 'logs',
        loadChildren: () =>
            import('./main/logs/logs.module').then((m) => m.LogsModule),
        data: { actions: [ACTION_LIST, ACTION_READ], subject: SUBJECT_LOGS },
        canActivate: [AuthGuard, PermissionsGuard],
    },

    {
        path: 'users',
        loadChildren: () =>
            import('./main/users/users.module').then((m) => m.UsersModule),
        data: { actions: [ACTION_LIST, ACTION_READ], subject: SUBJECT_USER },
        canActivate: [AuthGuard, PermissionsGuard],
    },

    // redirect to this component for invalid routes
    {
        path: '404',
        loadChildren: () =>
            import('./main/error-404/error-404.module').then(
                (m) => m.Error404Module
            ),
    },
    { path: '**', redirectTo: '404' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule { }
