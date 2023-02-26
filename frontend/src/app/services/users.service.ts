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
    private readonly USERS_URL = 'users';

    constructor(private apiService: ApiService) {}

    getUsers(options: FindAllUsersDto): Observable<PaginationResult<User>> {
        return this.apiService.get('users', {
            params: this.createListOptions(options),
        });
    }

    createListOptions(options: FindAllUsersDto): HttpParams {
        const { role, roles, active } = options;
        let params = this.apiService.createListRecordParameters(options, {
            sortables: UserSortables,
        });

        if (role) {
            params = params.append('role', role);
        }

        if (isBoolean(active)) {
            params = params.append('active', active ? 'true' : 'false');
        }

        // Filter by multiple user roles
        if (roles) {
            options.roles.forEach((userRole) => {
                params = params.append('roles[]', `${userRole}`);
            });
        }

        return params;
    }

    getUserById(
        userId: string | number,
        findUser: FindUserDto = null
    ): Observable<User> {
        const join = findUser?.join;

        let params = new HttpParams();

        if (join?.length) {
            join.forEach((relations) => {
                params = params.append('join', relations);
            });
        }

        return this.apiService.get(`${this.USERS_URL}/${userId}`, { params });
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

    undeleteUser(userId: string | number): Observable<User> {
        return this.editUser(
            {
                deletedAt: null,
            },
            userId as string
        );
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

    addFloristToUser(
        userId: string | number,
        floristId: string | number
    ): Observable<User> {
        return this.apiService.post(`${this.USERS_URL}/${userId}/florists`, {
            id: floristId,
        });
    }

    deleteFloristFromUser(
        userId: string | number,
        floristId: string | number
    ): Observable<User> {
        return this.apiService.delete(
            `${this.USERS_URL}/${userId}/florists/${floristId}`
        );
    }
}
