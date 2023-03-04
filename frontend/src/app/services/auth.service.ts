import { HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUser } from '@models';
import { isString } from 'lodash';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly USERS_URL = 'user';

    constructor(private apiService: ApiService) {}

    loginByStudentId(studentId: string | number): Observable<AuthUser> {
        let params: HttpParams = new HttpParams();

        if (isString(studentId)) {
            params = params.append('studentId', studentId);
        }

        return this.apiService.get(`${this.USERS_URL}/getUserByStudentId`, {
            params,
        });
    }

    loginByUserId(userId: string | number): Observable<AuthUser> {
        return this.apiService.get(`${this.USERS_URL}/getUserById/${userId}`);
    }

    getUserAccessToken(): Observable<AuthUser> {
        const authentication = JSON.parse(
            localStorage.getItem('authentication')
        );

        if (!authentication) {
            return;
        }

        const user: AuthUser = {
            studentId: authentication?.studentId,
            signInUserSession: authentication?.signInUserSession,
            role: authentication?.role,
        };

        return of(user);
    }

    logOut(global = false): Observable<any> {
        return of('Logout');
    }
}
