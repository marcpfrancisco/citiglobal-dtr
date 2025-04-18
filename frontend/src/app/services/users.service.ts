import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserSortables } from '@enums';
import {
    CreateUserDto,
    EditUserDto,
    FindAllUsersDto,
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
        return this.apiService.get(`${this.USERS_URL}/all`, {
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

    getUserById(id: string | number): Observable<User> {
        return this.apiService.get(`${this.USERS_URL}/${id}`);
    }

    createUser(partialUser: CreateUserDto): Observable<User> {
        return this.apiService.post(`${this.USERS_URL}`, partialUser);
    }

    editUser(partialUser: EditUserDto, id: string | number): Observable<User> {
        return this.apiService.put(`${this.USERS_URL}/${id}`, partialUser);
    }

    deleteUser(id: string): Observable<User> {
        return this.apiService.delete(`${this.USERS_URL}/${id}`);
    }

    changeUserPassword(userId: number): Observable<void> {
        return this.apiService.put(
            `${this.USERS_URL}/reset-password/${userId}`,
            {}
        );
    }

    adminResetUserPassword(userId: string): Observable<User> {
        return this.apiService.patch(
            `${this.USERS_URL}/admin-reset-password/${userId}`,
            {}
        );
    }

    addSubjectToUser(
        userId: string | number,
        subjectId: string | number
    ): Observable<User> {
        return this.apiService.post(`${this.USERS_URL}/${userId}/subjects`, {
            subjectId,
        });
    }

    deleteSubjectFromUser(
        userId: string | number,
        subjectId: string | number
    ): Observable<User> {
        return this.apiService.delete(
            `${this.USERS_URL}/${userId}/subjects/${subjectId}`
        );
    }
}
