import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PureAbility } from '@casl/ability';
import { AbilityModule } from '@casl/angular';
import { SnackbarMultilineService } from '@components';
import { AppAbility } from '@constants';
import {
    FuseProgressBarModule,
    FuseThemeOptionsModule,
} from '@fuse/components';
import { FuseSidebarModule } from '@fuse/components/sidebar/sidebar.module';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedMaterialModule } from '@material/shared';
import { TranslateModule } from '@ngx-translate/core';
import {
    ApiService,
    AuthService,
    FiltersService,
    PermissionsService,
    RouterService,
    SnackbarService,
    UsersService,
} from '@services';
import { StoresModule } from '@stores/stores.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { fuseConfig } from './fuse-config';
import { httpInterceptorProvider } from './interceptors/http-interceptors';
import { LayoutModule } from './layout/layout.module';
import { PipesModule } from './shared/pipes/pipes.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,

        TranslateModule.forRoot(),

        // Casl
        AbilityModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // Layout module of your application
        LayoutModule,

        // Ngrx Store Modules
        StoresModule,

        SharedMaterialModule,

        AppRoutingModule,
        PipesModule,
    ],
    providers: [
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility, useExisting: AppAbility },
        httpInterceptorProvider,
        ApiService,
        AuthService,
        FiltersService,
        PermissionsService,
        RouterService,
        SnackbarMultilineService,
        SnackbarService,
        UsersService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
