import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthenticationReducer } from '@stores/index';
import { RouterService } from '@services';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private store: Store<any>,
        private routerService: RouterService
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const isLoginPage = state.url === '/auth/login';
        const isPasswordResetPage = state.url === '/auth/new-password-required';

        return this.store.pipe(
            select(AuthenticationReducer.selectAuthenticationState),
            map(
                ({
                    signInUserSession,
                    currentUser,
                    changePasswordRequired,
                }) => {
                    const authenticated = signInUserSession && currentUser;
                    const requiresPasswordChange = changePasswordRequired;

                    // when inside login page
                    if (isLoginPage) {
                        // when authenticated, go to landing page by User role
                        if (authenticated) {
                            this.routerService.navigateToLandingPage(
                                currentUser.role
                            );
                            return false;
                        }
                        // or, proceed if not yet logged in
                        else {
                            return true;
                        }
                    }

                    // allow navigate if require password change
                    if (requiresPasswordChange) {
                        // force password change!
                        if (!isPasswordResetPage) {
                            this.router.navigate([
                                'auth',
                                'new-password-required',
                            ]);
                            return false;
                        } else {
                            return true;
                        }
                    }

                    // For other pages, authenticate if not yet authenticated.
                    if (!authenticated) {
                        this.router.navigate(['auth', 'login']);
                        return false;
                    }

                    // when authenticated, proceed!
                    return true;
                }
            ),
            take(1)
        );
    }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.canActivate(next, state);
    }
}
