import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedMaterialModule } from '@material/shared';
import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,

        FuseSharedModule,
        SharedMaterialModule,
        // Routing
        AuthenticationRoutingModule,
    ],
})
export class AuthenticationModule {}
