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

    login(username: string, password: string): Observable<AuthUser> {
        console.log(username, password);
        return this.apiService
            .post(`${this.AUTH_URL}/authenticate`, { username, password })
            .pipe(
                tap((response: any) => {
                    const { id, username, role, token } = response;
                    localStorage.setItem(
                        'authenticate',
                        JSON.stringify(response)
                    );

                    const authUser: AuthUser = {
                        username,
                        id,
                        role,
                        token,
                    };

                    console.log(authUser);
                    return of(authUser);
                })
            );
    }

    loginByUserId(userId: string | number): Observable<any> {
        return this.apiService.get(`${this.USERS_URL}/getUserById/${userId}`);
    }

    logOut(global = false): Observable<any> {
        return of('Logout');
    }
}
