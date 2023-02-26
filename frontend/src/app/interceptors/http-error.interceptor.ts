import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SnackbarService } from '@bloomlocal/ng-shared';

const DEFAULT_ERROR = 'Something went wrong.';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private snackbarService: SnackbarService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        // Succeeds
        (event) => {},
        // Operation failed; error is an HttpErrorResponse
        (httpErrorResponse) => {
          this.snackbarService.openError(DEFAULT_ERROR, httpErrorResponse);
        }
      )
    );
  }
}
