import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RootState } from '@stores/index';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseNavigationService } from 'src/@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from 'src/@fuse/components/sidebar/sidebar.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { navigation } from './navigation/navigation';
import { locale as navigationEnglish } from './navigation/i18n/en';
import { locale as navigationTurkish } from './navigation/i18n/tr';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationActions } from '@stores/authentication';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    private previousUrlSubcription: Subscription;
    private currentUrl: string;
    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform,
        private store: Store<RootState>,
        // private routerService: RouterService,
        private router: Router
    ) {
        // Get default navigation
        this.navigation = navigation;

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

        // Add languages
        this._translateService.addLangs(['en', 'tr']);

        // Set the default language
        this._translateService.setDefaultLang('en');

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(
            navigationEnglish,
            navigationTurkish
        );

        // Use a language
        this._translateService.use('en');

        // Add is-mobile class to the body if the platform is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;

                // Boxed
                if (this.fuseConfig.layout.width === 'boxed') {
                    this.document.body.classList.add('boxed');
                } else {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let i = 0; i < this.document.body.classList.length; i++) {
                    const className = this.document.body.classList[i];

                    if (className.startsWith('theme-')) {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });

        // Load Current User
        this.store.dispatch(AuthenticationActions.onLoadCurrentUser());

        // Update Ability
        this.store.dispatch(AuthenticationActions.onRefreshAbility());
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.previousUrlSubcription.unsubscribe();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
}
