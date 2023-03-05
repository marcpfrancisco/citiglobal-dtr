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
import { Observable } from 'rxjs';

import { RootState } from '../stores';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    // implements HttpInterceptor
    constructor(
        private readonly authService: AuthService,
        private store: Store<RootState>,
        @Inject(SERVICE_CONFIG)
        private config: { apiUrl: string }
    ) {}

    intercept<T = any>(
        request: HttpRequest<T>,
        next: HttpHandler
    ): Observable<HttpEvent<T>> {
        // Get token from session;
        const storage = JSON.parse(localStorage.getItem('authentication'));
        const headers = {};

        if (!request.headers.has('Content-Type')) {
            headers['Content-Type'] = 'application/json';
        }

        const isApiCall = isSameHostname(request.url, this.config.apiUrl);

        if (storage['token'] && isApiCall) {
            headers['Authorization'] = 'Bearer ' + storage['token'];
        }

        const authReq = request.clone({
            setHeaders: headers,
        });

        return next.handle(authReq);
    }
}
