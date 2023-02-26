import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SimpleSnackBar } from '@angular/material/snack-bar/simple-snack-bar';
import { MatSnackBarRef } from '@angular/material/snack-bar/snack-bar-ref';
import { DEFAULT_SNACKBAR_CONFIG } from '@constants';
import { get, isArray, isObjectLike, isString } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    constructor(private _matSnackBar: MatSnackBar) {}

    /**
     * Open a success SnackBar that will disappear after 3 seconds
     *
     * @param message
     * @param config
     */
    openSuccess(
        message: string,
        config?: MatSnackBarConfig
    ): MatSnackBarRef<SimpleSnackBar> {
        const finalConfig = {
            ...DEFAULT_SNACKBAR_CONFIG,
            ...config,
        };

        return this._matSnackBar.open(message, null, finalConfig);
    }

    /**
     * Open an error SnackBar that will disappear after 10 seconds
     *
     * @param message
     * @param config
     */
    openError(
        message: string,
        error = null,
        config?: MatSnackBarConfig
    ): MatSnackBarRef<SimpleSnackBar> {
        const status = (error as HttpErrorResponse)?.status || 0;
        const finalConfig = {
            ...DEFAULT_SNACKBAR_CONFIG,
            ...config,
            panelClass: ['mat-toolbar', 'red-600'],
        };

        // for HTTP errors, message parameter is only used for HTTP 500 and above
        if (!status || status >= 500) {
            return this._matSnackBar.open(message, null, finalConfig);
        }

        return this._matSnackBar.open(
            this.resolveErrorMessage(error as HttpErrorResponse, message),
            null,
            finalConfig
        );
    }

    private resolveErrorMessage(
        httpResponse: HttpErrorResponse,
        defaultErrorMessage: string
    ): string {
        if (!isObjectLike(httpResponse) && !(httpResponse instanceof Error)) {
            return defaultErrorMessage;
        }

        const responseErrorMessage = get(httpResponse, 'error.message');

        // return first found error string
        return [
            isArray(responseErrorMessage)
                ? responseErrorMessage[0]
                : responseErrorMessage,
            httpResponse.message,
            defaultErrorMessage,
        ].find((error) => !!error && isString(error));
    }
}
