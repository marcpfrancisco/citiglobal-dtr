import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedComponentsModule } from '@components';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedMaterialModule } from '@material/shared';
import { UserIdentifcationCardComponent } from '../users/user-identification-card/user-identification-card.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { TimeLogComponent } from './time-log/time-log.component';

@NgModule({
    declarations: [
        AdminLoginComponent,
        TimeLogComponent,
        UserIdentifcationCardComponent,
    ],
    imports: [
        CommonModule,

        FuseSharedModule,
        SharedMaterialModule,
        SharedComponentsModule,
        // Routing
        AuthenticationRoutingModule,
    ],
    entryComponents: [UserIdentifcationCardComponent],
})
export class AuthenticationModule {}
