import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { FuseSearchBarModule } from '@fuse/components/search-bar/search-bar.module';
import { FuseShortcutsModule } from '@fuse/components/shortcuts/shortcuts.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { PipesModule } from '@pipes';
import { UserProfileComponent } from 'src/app/main/users/user-profile/user-profile.component';

import { ToolbarComponent } from './toolbar.component';

@NgModule({
    declarations: [ToolbarComponent, UserProfileComponent],
    imports: [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        MatDialogModule,
        MatFormFieldModule,
        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule,
        MatInputModule,
        PipesModule,
    ],
    exports: [ToolbarComponent],
    entryComponents: [UserProfileComponent],
})
export class ToolbarModule {}
