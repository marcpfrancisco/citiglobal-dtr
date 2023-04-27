import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { RootState } from '@stores/index';
import { Store } from '@ngrx/store';
import { selectAuthToken } from '@stores/authentication/authentication.reducer';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ReportsService {
    private readonly REPORTS_URL = 'reports';

    constructor(
        private apiService: ApiService,
        private store: Store<RootState>
    ) {}

    downloadAllTimeSheet(): Observable<string> {
        return this.store.select(selectAuthToken).pipe(
            switchMap((token) => {
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                return this.apiService.get(`${this.REPORTS_URL}/all`, {
                    headers,
                    responseType: 'blob',
                    observe: 'response',
                });
            }),
            map((response: any) => {
                const contentDisposition = response.headers.get(
                    'Content-Disposition'
                );
                console.log(contentDisposition);
                const filename =
                    this.getFilenameFromContentDisposition(contentDisposition);
                const blob = new Blob([response.body], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                const blobUrl = window.URL.createObjectURL(blob);

                return `${blobUrl}`;
            })
        );
    }

    downloadStudentTimeSheet(studentNo: string): Observable<string> {
        return this.store.select(selectAuthToken).pipe(
            switchMap((token) => {
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                return this.apiService.get(
                    `${this.REPORTS_URL}/${studentNo}?startDate=01-01-1979&endDate=01-01-2050`,
                    {
                        headers,
                        responseType: 'blob',
                        observe: 'response',
                    }
                );
            }),
            map((response: any) => {
                const contentDisposition = response.headers.get(
                    'Content-Disposition'
                );
                console.log(contentDisposition);
                const filename =
                    this.getFilenameFromContentDisposition(contentDisposition);
                const blob = new Blob([response.body], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                const blobUrl = window.URL.createObjectURL(blob);

                return `${blobUrl}`;
            })
        );
    }

    // this.apiService
    // .get(`${this.REPORTS_URL}/${studentNo}?startDate=01-01-1979&endDate=01-01-2050`, {
    //     headers,
    //     responseType: 'blob',
    //     observe: 'response',
    // })
    // .subscribe((blob: Blob) => {
    //     const url = window.URL.createObjectURL(blob);
    //     window.open(url, '_blank');
    // });

    private getFilenameFromContentDisposition(
        contentDisposition: string | null | undefined
    ): string {
        const defaultFilename = 'report.xlsx';
        if (!contentDisposition) {
            return defaultFilename;
        }

        const matches = contentDisposition.match(/filename="?([^";]+)"?/);
        if (!matches || matches.length < 2) {
            return defaultFilename;
        }

        return matches[1];
    }
}
