import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '@components';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedMaterialModule } from '@material/shared';
import { PipesModule } from '@pipes';

import { LogListComponent } from './log-list/log-list.component';
import { LogsRoutingModule } from './logs-routing.module';

@NgModule({
    declarations: [LogListComponent],
    imports: [
        CommonModule,
        LogsRoutingModule,
        ReactiveFormsModule,
        SharedMaterialModule,
        SharedComponentsModule,
        FuseSharedModule,
        PipesModule,
    ],
})
export class LogsModule {}
