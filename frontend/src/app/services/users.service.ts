import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserSortables } from '@enums';
import {
    CreateUserDto,
    EditUserDto,
    FindAllUsersDto,
    FindUserDto,
    PaginationResult,
} from '@interfaces';
import { User } from '@models';
import { isBoolean } from 'lodash';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
    private readonly USERS_URL = 'user';

    constructor(private apiService: ApiService) {}

    getUsers(options: FindAllUsersDto): Observable<PaginationResult<User>> {
        return this.apiService.get('user', {
            params: this.createListOptions(options),
        });
    }

    createListOptions(options: FindAllUsersDto): HttpParams {
        const { role, roles, isActive } = options;
        let params = this.apiService.createListRecordParameters(options, {
            sortables: UserSortables,
        });

        if (role) {
            params = params.append('role', role);
        }

        if (isBoolean(isActive)) {
            params = params.append('isActive', isActive ? 'true' : 'false');
        }

        // Filter by multiple user roles
        if (roles) {
            options.roles.forEach((userRole) => {
                params = params.append('roles[]', `${userRole}`);
            });
        }

        return params;
    }

    getUserById(userId: string | number): Observable<User> {
        return this.apiService.get(`${this.USERS_URL}/${userId}`);
    }

    createUser(partialUser: CreateUserDto): Observable<User> {
        return this.apiService.post(this.USERS_URL, partialUser);
    }

    editUser(
        partialUser: EditUserDto,
        userId: string | number
    ): Observable<User> {
        return this.apiService.patch(
            `${this.USERS_URL}/${userId}`,
            partialUser
        );
    }

    deleteUser(userId: string): Observable<User> {
        return this.apiService.delete(`${this.USERS_URL}/${userId}`);
    }

    changeUserPassword(userId: string): Observable<void> {
        return this.apiService.post(
            `${this.USERS_URL}/${userId}/reset-password`,
            {}
        );
    }

    adminResetUserPassword(userId: string): Observable<User> {
        return this.apiService.patch(
            `${this.USERS_URL}/${userId}/admin-reset-password`,
            {}
        );
    }
}
