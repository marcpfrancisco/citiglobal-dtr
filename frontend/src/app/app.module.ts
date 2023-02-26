import { HttpClientModule } from '@angular/common/http';
import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AbilityModule } from '@casl/angular';
import {
    FuseProgressBarModule,
    FuseThemeOptionsModule,
} from '@fuse/components';
import { FuseSidebarModule } from '@fuse/components/sidebar/sidebar.module';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateModule } from '@ngx-translate/core';

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

        AppRoutingModule,
        PipesModule,

        // Layout module of your application
        LayoutModule,

        // Ngrx Store Modules
        StoreModule.forRoot({}, {}),
        EffectsModule.forRoot([]),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    ],
    providers: [httpInterceptorProvider],
    bootstrap: [AppComponent],
})
export class AppModule {}
