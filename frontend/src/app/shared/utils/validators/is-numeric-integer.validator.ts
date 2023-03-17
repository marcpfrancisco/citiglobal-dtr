import { AbstractControl, ValidationErrors } from '@angular/forms';
import { isNumber } from 'lodash';
import { NgValidator } from './ng-validator.type';

const NUMERIC_INTEGER_PATTERN = /^(0|[1-9][0-9]*)$/;

export interface IsNumericIntegerValidatorOptions {
    isAllowUndefined;
}

export function isNumericInteger(): NgValidator {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        const stringified = `${value}`;

        if (
            typeof value === 'undefined' ||
            value === null ||
            value === '' ||
            value === 0 ||
            isNumber(value)
        ) {
            return null;
        }

        return NUMERIC_INTEGER_PATTERN.test(stringified)
            ? // success if empty or matches the pattern
              null
            : // error if doesn't match the pattern
              {
                  invalidEmptyInput: {
                      value: stringified,
                  },
                  invalidInput: true,
              };
    };
}
