import { isNumericInteger } from './is-numeric-integer.validator';
import { isNotEmptyStringInput } from './is-not-empty-string-input.validator';

export * from './ng-validator.type';

export const NgValidators = {
    isNotEmptyStringInput,
    isNumericInteger,
};
