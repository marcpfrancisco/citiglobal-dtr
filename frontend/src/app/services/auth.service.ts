import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isString, pick } from 'lodash';
import { Observable, of } from 'rxjs';
import { AuthUser, User } from '@models';

import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly USERS_URL = 'user';

    constructor(private apiService: ApiService) {}

    loginByStudentId(studentId: string | number): Observable<User> {
        let params: HttpParams = new HttpParams();

        if (isString(studentId)) {
            params = params.append('studentId', studentId);
        }

        const authUser: any = {
            studentId: '8700',
            isAdmin: true,
            role: 'superadmin',
        };

        return of(authUser);

        // return this.apiService.get(`${this.USERS_URL}/getUserByStudentId`, {
        //     params,
        // });
    }

    loginByUserId(id: string | number): Observable<any> {
        let params: HttpParams = new HttpParams();

        if (isString(id)) {
            params = params.append('id', id);
        }

        const authUser: any = {
            studentId: '8700',
            isAdmin: true,
            role: 'superadmin',
        };

        return of(authUser);

        // return this.apiService.get(`${this.USERS_URL}/getUserById`, {
        //     params,
        // });
    }

    logOut(global = false): Observable<any> {
        return of('Logout');
    }
}
