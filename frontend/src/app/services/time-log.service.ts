import { Injectable } from '@angular/core';
import { FindAllTimeLogDto } from '@interfaces';
import { Observable } from 'rxjs';

import { PaginationResult, TimeLog } from '../shared';
import { CreateTimeLogDto } from '../shared/interfaces/time-log/create-time-log-dto.interface';
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

    postTimeRecord(rfidNo: string | number): Observable<TimeLog> {
        console.log(rfidNo, 'rfidNo');
        return this.apiService.post(`${this.TIMELOG_URL}/dailyTimeRecord`, {
            rfidNo,
        });
    }
}
