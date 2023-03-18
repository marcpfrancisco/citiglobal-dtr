import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isBoolean } from 'lodash';
import { Observable } from 'rxjs';

import {
    CreateSubjectDto,
    EditSubjectDto,
    isNumericInteger,
    PaginationResult,
    SubjectModel,
    SubjectSortables,
} from '../shared';
import { FindAllSubjectsDto } from '../shared/interfaces/subjects/find-all-subjects-dto.interface';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SubjectsService {
    private readonly SUBJECT_URL = 'subjects';

    constructor(private apiService: ApiService) {}

    getSubjects(
        options: FindAllSubjectsDto
    ): Observable<PaginationResult<SubjectModel>> {
        return this.apiService.get(`${this.SUBJECT_URL}/all`, {
            params: this.createListOptions(options),
        });
    }

    getSubjectById(subjectId: number): Observable<SubjectModel> {
        return this.apiService.get(`${this.SUBJECT_URL}/${subjectId}`);
    }

    create(payload: CreateSubjectDto): Observable<SubjectModel> {
        return this.apiService.post(`${this.SUBJECT_URL}`, payload);
    }

    update(
        subjectId: number,
        payload: EditSubjectDto
    ): Observable<SubjectModel> {
        return this.apiService.put(`${this.SUBJECT_URL}/${subjectId}`, payload);
    }

    createListOptions(options: FindAllSubjectsDto): HttpParams {
        const { userId, isActive } = options;
        let params = this.apiService.createListRecordParameters(options, {
            sortables: SubjectSortables,
        });

        if (isNumericInteger(userId)) {
            params = params.append('userId', userId);
        }

        if (isBoolean(isActive)) {
            params = params.append('isActive', isActive ? 'true' : 'false');
        }

        return params;
    }
}
