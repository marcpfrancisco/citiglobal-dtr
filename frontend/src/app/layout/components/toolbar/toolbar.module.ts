import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FuseSharedModule } from '@fuse/shared.module';

import { ToolbarComponent } from './toolbar.component';
@NgModule({
    declarations: [ToolbarComponent],
    imports: [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        MatDialogModule,
        MatFormFieldModule,
        FuseSharedModule,
        MatInputModule,
    ],
    exports: [ToolbarComponent],
})
export class ToolbarModule {}
