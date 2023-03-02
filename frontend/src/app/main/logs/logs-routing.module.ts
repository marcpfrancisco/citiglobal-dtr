import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogListComponent } from './log-list/log-list.component';

const routes: Routes = [{ path: '', component: LogListComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LogsRoutingModule {}
