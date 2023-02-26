import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatSnackBarRef } from '@angular/material/snack-bar/snack-bar-ref';
import { DEFAULT_SNACKBAR_CONFIG } from '@constants';
import { numberify } from '@utils';
import { isArray, isString } from 'lodash';

import { SnackbarMultilineComponent } from './snackbar-multiline.component';

const DEFAULT_ERROR_MESSAGE = 'Unknown HTTP request error.';
const DEFAULT_SUCCESS_MESSAGE = 'Done.';
const DEFAULT_ERROR_CODE = 0;

@Injectable({
    providedIn: 'root',
})
export class SnackbarMultilineService {
    constructor(private matSnackBarService: MatSnackBar) {}

    /**
     * Open a success SnackBar that will disappear after 3 seconds
     *
     * @param message
     * @param config
     */
    openSuccess(
        message: string,
        config?: MatSnackBarConfig
    ): MatSnackBarRef<SnackbarMultilineComponent> {
        const data = this.stringifyMessage(message) || DEFAULT_SUCCESS_MESSAGE;
        const finalConfig = {
            ...DEFAULT_SNACKBAR_CONFIG,
            ...config,
            data,
        };

        return this.matSnackBarService.openFromComponent(
            SnackbarMultilineComponent,
            finalConfig
        );
    }

    /**
     * Open an error SnackBar that will disappear after 10 seconds
     *
     * @param message
     * @param config
     */
    openError<ErrorResponse extends Error | HttpErrorResponse>(
        message: string | ErrorResponse | null,
        error: ErrorResponse | null = null,
        config?: MatSnackBarConfig
    ): MatSnackBarRef<SnackbarMultilineComponent> {
        const status =
            numberify((error as HttpErrorResponse)?.status) ||
            DEFAULT_ERROR_CODE;

        let data = this.resolveErrorMessageFrom(message, error);

        // for HTTP errors, message parameter is only used for HTTP 500 and above
        if (!status || status >= 500) {
            data =
                this.resolveErrorMessageFrom(message) ||
                // or fallback to old value
                data;
        }

        const finalConfig = {
            ...DEFAULT_SNACKBAR_CONFIG,
            ...config,
            panelClass: ['mat-toolbar', 'red-600'],
            data,
        };

        return this.matSnackBarService.openFromComponent(
            SnackbarMultilineComponent,
            finalConfig
        );
    }

    private resolveErrorMessageFrom<
        ErrorResponse extends Error | HttpErrorResponse
    >(...items: Array<ErrorResponse | string>): string {
        let length = items.length;

        if (!items.length) {
            return DEFAULT_ERROR_MESSAGE;
        }

        for (let c = 0; length--; ) {
            const item = items[c++];

            // try treating default error message as HTTP response
            let message = this.stringifyMessage(
                (item as HttpErrorResponse)?.error?.message
            );

            // use response message if has value
            if (message) {
                return message;
            }

            // try treating default error message as Error object
            message = this.stringifyMessage((item as ErrorResponse)?.message);

            // use response message if has value
            if (message) {
                return message;
            }

            // try treating it as normal string
            message = this.stringifyMessage(item);
            if (message) {
                return message;
            }
        }

        // fallback
        return DEFAULT_ERROR_MESSAGE;
    }

    private stringifyMessage<Message>(message: Message): string {
        if (isArray(message)) {
            const list = message.filter((value) => isString(value) && value);

            return list.join(' ');
        }

        switch (typeof message) {
            case 'string':
                return message;
            case 'number':
                if (isFinite(message)) {
                    return `${message}`;
                }
            // falls through
            default:
                return '';
        }
    }
}
