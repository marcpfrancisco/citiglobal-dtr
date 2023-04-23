import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { Store } from '@ngrx/store';
import { LoginReducer, RootState } from '@stores/index';
import { LoginActions } from '@stores/login';
import { combineLatest, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
    selector: 'citiglobal-admin-login',
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AdminLoginComponent implements OnInit {
    loginForm: FormGroup;
    loginButtonDisabled$: Observable<boolean>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private fuseConfigService: FuseConfigService,
        private formBuilder: FormBuilder,
        private store: Store<RootState>,
        @Inject('APP_BUILD_VERSION') public buildVersion: string
    ) {
        // Configure the layout
        this.fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true,
                },
                toolbar: {
                    hidden: true,
                },
                footer: {
                    hidden: true,
                },
                sidepanel: {
                    hidden: true,
                },
            },
        };
    }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            // Validators.email
            username: ['', [Validators.required]],
            password: ['', Validators.required],
        });

        this.store.dispatch(LoginActions.onAdminLoginInit());
        this.setupObservables();
    }

    onSubmit(): void {
        const { username, password } = this.loginForm.value;
        this.store.dispatch(LoginActions.onLogin({ username, password }));
    }

    private setupObservables(): void {
        this.loginButtonDisabled$ = combineLatest([
            this.loginForm.statusChanges,
            this.store.select(LoginReducer.selectLoginButtonDisabled),
        ]).pipe(
            map(([status, loginButtonDisabled]) => {
                return this.loginForm.invalid;
            }),
            startWith(true)
        );
    }
}
