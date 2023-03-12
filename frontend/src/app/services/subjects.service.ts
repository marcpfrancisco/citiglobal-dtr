import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isBoolean, isString } from 'lodash';
import { Observable } from 'rxjs';

import {
    PaginationResult,
    Section,
    SectionSortables,
    SubjectModel,
} from '../shared';
import { FindAllSubjectsDto } from '../shared/interfaces/subjects/find-all-subjects-dto.interface';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SubjectsService {
    private readonly SUBJECT_URL = 'subject';

    constructor(private apiService: ApiService) {}

    getSubjects(
        options: FindAllSubjectsDto
    ): Observable<PaginationResult<SubjectModel>> {
        return this.apiService.get(`${this.SUBJECT_URL}/getAllSubject`, {
            params: this.createListOptions(options),
        });
    }

    createListOptions(options: FindAllSubjectsDto): HttpParams {
        const { subjectCode, description, isActive } = options;
        let params = this.apiService.createListRecordParameters(options, {
            sortables: SectionSortables,
        });

        if (isString(subjectCode)) {
            params = params.append('subjectCode', subjectCode);
        }

        if (isString(description)) {
            params = params.append('description', description);
        }

        if (isBoolean(isActive)) {
            params = params.append('isActive', isActive ? 'true' : 'false');
        }

        return params;
    }
}
