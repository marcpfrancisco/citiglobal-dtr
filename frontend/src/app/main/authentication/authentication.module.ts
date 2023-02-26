import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedMaterialModule } from '@material/shared';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { TimeLogComponent } from './time-log/time-log.component';

@NgModule({
    declarations: [AdminLoginComponent, TimeLogComponent],
    imports: [
        CommonModule,

        FuseSharedModule,
        SharedMaterialModule,
        // Routing
        AuthenticationRoutingModule,
    ],
})
export class AuthenticationModule {}
