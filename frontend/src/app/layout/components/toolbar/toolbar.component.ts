import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { Store } from '@ngrx/store';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import {
    UserProfileComponent,
    UserProfileDialogResult,
    UserProfileDialogResultType,
} from './../../../main/users/user-profile/user-profile.component';

import { navigation } from './../../../navigation/navigation';

// import { AuthenticationActions } from '../../../stores/authentication';
import { User } from '@models';
import { RootState, AuthenticationReducer } from '@stores/index';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ToolbarComponent implements OnInit, OnDestroy {
    user$: Observable<User>;

    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private dialog: MatDialog,
        private store: Store<RootState>
    ) {
        // Set the defaults
        this.userStatusOptions = [
            {
                title: 'Online',
                icon: 'icon-checkbox-marked-circle',
                color: '#4CAF50',
            },
            {
                title: 'Away',
                icon: 'icon-clock',
                color: '#FFC107',
            },
            {
                title: 'Do not Disturb',
                icon: 'icon-minus-circle',
                color: '#F44336',
            },
            {
                title: 'Invisible',
                icon: 'icon-checkbox-blank-circle-outline',
                color: '#BDBDBD',
            },
            {
                title: 'Offline',
                icon: 'icon-checkbox-blank-circle-outline',
                color: '#616161',
            },
        ];

        this.languages = [
            {
                id: 'en',
                title: 'English',
                flag: 'us',
            },
            {
                id: 'tr',
                title: 'Turkish',
                flag: 'tr',
            },
        ];

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar =
                    settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, {
            id: this._translateService.currentLang,
        });

        // Set user
        // this.user$ = this.store.select(AuthenticationReducer.selectCurrentUser);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
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

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    handleProfile(user: User): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = 'bloomlocal-user-profile';
        dialogConfig.data = user;

        const dialogRef = this.dialog.open(UserProfileComponent, dialogConfig);
        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: UserProfileDialogResult) => {
                // switch (data?.type) {
                //     case UserProfileDialogResultType.SAVE:
                //         this.store.dispatch(
                //             AuthenticationActions.onUpdateCurrentUser({
                //                 partialUser: data?.value,
                //             })
                //         );
                //         return;
                //     case UserProfileDialogResultType.RESET:
                //         this.store.dispatch(
                //             AuthenticationActions.onResetCurrentUserPassword()
                //         );
                //         return;
                // }
            });
    }

    // onLogout(): void {
    //     this.store.dispatch(AuthenticationActions.onLogout());
    // }
}
