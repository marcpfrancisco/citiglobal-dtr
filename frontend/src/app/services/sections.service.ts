import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isBoolean, isString } from 'lodash';
import { Observable } from 'rxjs';
import { PaginationResult, Section, SectionSortables } from '../shared';
import { FindAllSectionsDto } from '../shared/interfaces/section/find-all-sections-dto.interface';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SectionsService {
    private readonly SECTION_URL = 'section';

    constructor(private apiService: ApiService) {}

    getSections(
        options: FindAllSectionsDto
    ): Observable<PaginationResult<Section>> {
        return this.apiService.get(`${this.SECTION_URL}/getAllSection`, {
            params: this.createListOptions(options),
        });
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
