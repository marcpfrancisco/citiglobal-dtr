import { HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUser, SignInUserSession } from '@models';
import { isString } from 'lodash';
import { from, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly USERS_URL = 'user';
    private readonly AUTH_URL = 'authentication';

    constructor(private apiService: ApiService) {}

    login(username: string, password: string): Observable<any> {
        return this.apiService
            .post(`${this.AUTH_URL}/authenticate`, { username, password })
            .pipe(tap((response) => this.setSignInUserSession(response)));
    }

    loginByUserId(userId: string | number): Observable<any> {
        return this.apiService.get(`${this.USERS_URL}/getUserById/${userId}`);
    }

    setSignInUserSession(response: any) {
        if (!response) return;

        const { username, token, id: userId, roles = [] } = response;
        const signInUserSession = { username, token, userId, roles };
        const payload = JSON.stringify(signInUserSession);

        localStorage.setItem('authenticate', payload);
    }

    getCurrentAuthenticatedUser() {
        const storage = JSON.parse(localStorage.getItem('authenticate'));
        return of(storage);
    }

    logOut(global = false): Observable<any> {
        return of('Logout');
    }
}
