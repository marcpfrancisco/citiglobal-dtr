import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isBoolean, isString } from 'lodash';
import { Observable } from 'rxjs';

import { Course, CourseSortables, PaginationResult } from '../shared';
import { FindAllCoursesDto } from '../shared/interfaces/course/find-all-courses-dto.interface';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CourseService {
    private readonly COURSE_URL = 'courses';

    constructor(private apiService: ApiService) {}

    getCourses(options: any): Observable<PaginationResult<Course>> {
        return this.apiService.get(`${this.COURSE_URL}/all`, {
            params: this.createListOptions(options),
        });
    }

    getCourseById(courseId: number): Observable<Course> {
        return this.apiService.get(`${this.COURSE_URL}/${courseId}`);
    }

    createListOptions(options: FindAllCoursesDto): HttpParams {
        const { name, isActive } = options;
        let params = this.apiService.createListRecordParameters(options, {
            sortables: CourseSortables,
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
