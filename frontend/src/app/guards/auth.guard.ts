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
        const isLoginPage = state.url === '/auth/time-log';
        const isAdminLoginPage = state.url === '/auth/admin-login';

        console.log(state.url);

        return this.store.pipe(
            select(AuthenticationReducer.selectAuthenticationState),
            map(({ token, currentUser }) => {
                const authenticated = token && currentUser;

                console.log(authenticated, 'authenticated');

                // when inside login page
                if (isAdminLoginPage) {
                    // when authenticated, go to landing page by User role
                    if (authenticated) {
                        this.routerService.navigateToLandingPage(
                            currentUser[0]?.role
                        );
                        return false;
                    }
                    // or, proceed if not yet logged in
                    else {
                        return true;
                    }
                }

                // For other pages, authenticate if not yet authenticated.
                if (!authenticated) {
                    this.router.navigate(['auth', 'time-log']);
                    return false;
                }

                // when authenticated, proceed!
                return true;
            }),
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
