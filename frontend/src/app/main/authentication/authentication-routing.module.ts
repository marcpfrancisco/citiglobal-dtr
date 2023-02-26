import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { TimeLogComponent } from './time-log/time-log.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'time-log',
        pathMatch: 'full',
    },
    {
        path: 'time-log',
        component: TimeLogComponent,
    },
    {
        path: 'admin-login',
        component: AdminLoginComponent,
        // canActivate: [AuthGuard],
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class AuthenticationRoutingModule {}
