import { Injectable } from '@angular/core';
import { AuthUser } from '@models';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly USERS_URL = 'users';
    private readonly AUTH_URL = 'authentication';

    constructor(private apiService: ApiService) {}

    login(username: string, password: string): Observable<AuthUser> {
        return this.apiService
            .post(`${this.AUTH_URL}`, { username, password })
            .pipe(
                switchMap((response: any) => {
                    const { id, username, role, token } = response;

                    const authUser: AuthUser = {
                        username,
                        id,
                        role,
                        token,
                    };

                    return of(authUser);
                })
            );
    }

    loginByStudentNumber(studentNo: number): Observable<any> {
        return this.apiService.get(`${this.USERS_URL}/student-no/${studentNo}`);
    }

    getCurrentSignInUser(response: any) {
        return response;
    }

    logOut(global = false): Observable<any> {
        return of('Logout');
    }
}
