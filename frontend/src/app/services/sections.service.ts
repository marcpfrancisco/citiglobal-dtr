import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isBoolean, isString } from 'lodash';
import { Observable } from 'rxjs';

import {
    CreateSectionDto,
    EditSectionDto,
    FindAllSectionsDto,
    FindAllSectionUsersDto,
    isNumericInteger,
    PaginationResult,
    Section,
    SectionSortables,
    User,
    UserSortables,
} from '../shared';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SectionsService {
    private readonly SECTION_URL = 'sections';

    constructor(private apiService: ApiService) {}

    getSections(
        options: FindAllSectionsDto
    ): Observable<PaginationResult<Section>> {
        return this.apiService.get(`${this.SECTION_URL}/all`, {
            params: this.createListOptions(options),
        });
    }

    getSectionById(sectionId: number): Observable<Section> {
        return this.apiService.get(`${this.SECTION_URL}/${sectionId}`);
    }

    getSectionUsers(
        options: FindAllSectionUsersDto
    ): Observable<PaginationResult<User>> {
        return this.apiService.get(
            `${this.SECTION_URL}/${options.sectionId}/students`,
            { params: this.createOptions(options) }
        );
    }

    create(payload: CreateSectionDto): Observable<Section> {
        return this.apiService.post(`${this.SECTION_URL}`, payload);
    }

    update(sectionId: number, payload: EditSectionDto): Observable<Section> {
        return this.apiService.put(`${this.SECTION_URL}/${sectionId}`, payload);
    }

    deleteUserFromSetion(userIds: number): Observable<User> {
        return this.apiService.delete(`${this.SECTION_URL}/remove/${userIds}`);
    }

    createOptions(options: FindAllSectionUsersDto): HttpParams {
        const { name, sectionId, isActive } = options;
        let params = this.apiService.createListRecordParameters(options, {
            sortables: UserSortables,
        });

        if (isString(name)) {
            params = params.append('firstName', name);
        }

        if (isNumericInteger(sectionId)) {
            params = params.append('sectionId', sectionId);
        }

        if (isBoolean(isActive)) {
            params = params.append('isActive', isActive ? 'true' : 'false');
        }

        return params;
    }

    createListOptions(options: FindAllSectionsDto): HttpParams {
        const { name, course, isActive } = options;
        let params = this.apiService.createListRecordParameters(options, {
            sortables: SectionSortables,
        });

        if (isString(name)) {
            params = params.append('name', name);
        }

        if (isBoolean(isActive)) {
            params = params.append('isActive', isActive ? 'true' : 'false');
        }

        return params;
    }
}
