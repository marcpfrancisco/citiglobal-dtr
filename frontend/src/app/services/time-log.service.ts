import { Injectable } from '@angular/core';
import { FindAllTimeLogDto } from '@interfaces';
import { Observable } from 'rxjs';

import { PaginationResult, TimeLog } from '../shared';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class TimeLogService {
    private readonly TIMELOG_URL = 'timesheet';

    constructor(private apiService: ApiService) {}

    getTimeSheet(
        options: FindAllTimeLogDto
    ): Observable<PaginationResult<TimeLog>> {
        return this.apiService.get(`${this.TIMELOG_URL}/getAllTimesheets`);
    }
}
