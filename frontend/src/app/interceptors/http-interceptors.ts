import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ProgressBarInterceptor } from './progress-bar.interceptor';
import { HttpRequestInterceptor } from './http-request.interceptor';
import { HttpErrorInterceptor } from './http-error.interceptor';

export const httpInterceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ProgressBarInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
];
