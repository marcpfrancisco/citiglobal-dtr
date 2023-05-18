import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FindAllTimeLogDto } from '@interfaces';
import { Observable } from 'rxjs';

import { PaginationResult, TimeLog, TimeLogSortables } from '../shared';
import { CreateTimeLogDto } from '../shared/interfaces/time-log/create-time-log-dto.interface';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class TimeLogService {
    private readonly TIMELOG_URL = 'timesheets';

    constructor(private apiService: ApiService) {}

    getTimeSheet(
        options: FindAllTimeLogDto
    ): Observable<PaginationResult<TimeLog>> {
        return this.apiService.get(`${this.TIMELOG_URL}/all`, {
            params: this.createListOptions(options),
        });
    }

    getTimeSheetByUserId(
        options: FindAllTimeLogDto
    ): Observable<PaginationResult<TimeLog>> {
        return this.apiService.get(
            `${this.TIMELOG_URL}/${options.userId}/users`,
            {
                params: this.createListOptions(options),
            }
        );
    }

    postTimeRecord(rfidNo: string | number): Observable<TimeLog> {
        return this.apiService.post(`${this.TIMELOG_URL}/daily-time-record`, {
            rfidNo,
        });
    }

    createListOptions(options: any): HttpParams {
        const { rfidNo } = options;
        let params = this.apiService.createListRecordParameters(options, {
            sortables: TimeLogSortables,
        });

        if (rfidNo) {
            params = params.append('rfidNo', rfidNo);
        }

        return params;
    }
}
