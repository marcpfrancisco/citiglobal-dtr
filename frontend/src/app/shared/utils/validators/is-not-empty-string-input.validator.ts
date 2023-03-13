import { AbstractControl, ValidationErrors } from '@angular/forms';
import { trim } from 'lodash';
import { NgValidator } from './ng-validator.type';

export function isNotEmptyStringInput(): NgValidator {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        const stringified = `${value}`;
        const returnError: ValidationErrors = {
            invalidEmptyInput: {
                value: stringified,
            },
        };

        // Don't allow null or undefined
        if (value === null || typeof value === 'undefined') {
            return returnError;
        }

        switch (typeof value) {
            case 'bigint':
            case 'number':
            case 'symbol':
            case 'string':
                // if string version is trimmed and results in non-empty string
                // then, this is a valid input
                if (trim(stringified) !== '') {
                    return null;
                }

            // falls through
            default:
                return returnError;
        }
    };
}
