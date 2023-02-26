import { isNumeric } from '@utils';
import { isNumber, isString } from 'lodash';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformNumberValue(value: any): number | null {
    if (typeof value === 'undefined' || value === null) {
        return null;
    }

    if (isString(value)) {
        return isNumeric(value) ? +value : null;
    }

    if (isNumber(value)) {
        return value;
    }

    return null;
}
