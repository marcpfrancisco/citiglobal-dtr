import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PureAbility } from '@casl/ability';
import { AbilityModule } from '@casl/angular';
import { SnackbarMultilineService } from '@components';
import { AppAbility, SERVICE_CONFIG } from '@constants';
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
    SectionsService,
    SnackbarService,
    SubjectsService,
    TimeLogService,
    UsersService,
} from '@services';
import { StoresModule } from '@stores/stores.module';
import { BuildVersion } from 'src/build-version';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { fuseConfig } from './fuse-config';
import { httpInterceptorProvider } from './interceptors/http-interceptors';
import { LayoutModule } from './layout/layout.module';
import { PipesModule } from '@pipes';
import { FxLayoutOverridesModule } from './shared/modules';

const { apiUrl } = environment;

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

        // Ngrx Store Modules
        StoresModule,

        // App modules
        LayoutModule,
        FxLayoutOverridesModule,
        SharedMaterialModule,
        AppRoutingModule,
        PipesModule,
    ],
    providers: [
        httpInterceptorProvider,
        { provide: 'APP_BUILD_VERSION', useValue: BuildVersion.number },
        { provide: SERVICE_CONFIG, useValue: { apiUrl } },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility, useExisting: AppAbility },

        ApiService,
        AuthService,
        FiltersService,
        PermissionsService,
        RouterService,
        SectionsService,
        SnackbarMultilineService,
        SnackbarService,
        SubjectsService,
        TimeLogService,
        UsersService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
