import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { SharedComponentsModule } from '@components';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedMaterialModule } from '@material/shared';
import { PipesModule } from '@pipes';

import { UsersRoutingModule } from './users-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        UsersRoutingModule,
        SharedMaterialModule,
        SharedComponentsModule,
        FuseSharedModule,
        UsersRoutingModule,
        MatMenuModule,
        PipesModule,
    ],
    providers: [],
    entryComponents: [],
    exports: [],
})
export class UsersModule {}
