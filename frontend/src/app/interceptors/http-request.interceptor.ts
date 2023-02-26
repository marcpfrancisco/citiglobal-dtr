import { PlatformLocation } from '@angular/common';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SERVICE_CONFIG } from '@constants';
import { Store } from '@ngrx/store';
import { AuthService } from '@services';
import { AuthenticationActions } from '@stores/authentication';
import { isSameHostname } from '@utils';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { RootState } from '../stores';

@Injectable()
export class HttpRequestInterceptor {
    // implements HttpInterceptor
    constructor(
        private readonly authService: AuthService,
        private browserLocation: PlatformLocation,
        private store: Store<RootState>,
        @Inject(SERVICE_CONFIG)
        private config: { apiUrl: string }
    ) {}

    // intercept<T = any>(
    //     request: HttpRequest<T>,
    //     next: HttpHandler
    // ): Observable<HttpEvent<T>> {
    //     return this.authService.currentSignInUserSession().pipe(
    //         catchError(() => of(null)),
    //         // Update the store
    //         tap((user) => {
    //             // bypass cognito auth headers if not logged in.
    //             if (user) {
    //                 this.store.dispatch(
    //                     AuthenticationActions.onCurrentSignInUserSessionSuccess(
    //                         { user }
    //                     )
    //                 );
    //             }
    //         }),
    //         switchMap((user) => {
    //             return next.handle(
    //                 user
    //                     ? // use credentials if authenticated
    //                       this.setAuthHeaders(user, request)
    //                     : // otherwise, do nothing
    //                       request
    //             );
    //         })
    //     );
    // }

    // private setAuthHeaders<T>(
    //     user: AuthUser,
    //     request: HttpRequest<T>
    // ): HttpRequest<T> {
    //     const isApiCall = isSameHostname(request.url, this.config.apiUrl);
    //     const accessToken = user?.signInUserSession?.accessToken;
    //     if (accessToken && isApiCall) {
    //         return request.clone({
    //             headers: request.headers.set(
    //                 'Authorization',
    //                 'Bearer ' + accessToken
    //             ),
    //         });
    //     }

    //     return request;
    // }
}
