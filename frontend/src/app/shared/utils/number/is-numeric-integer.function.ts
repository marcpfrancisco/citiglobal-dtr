import { INTEGER_PATTERN } from '../../constants/number.constant';

export function isNumericInteger<ExpectedType>(
    value: ExpectedType
): value is ExpectedType {
    switch (typeof value) {
        case 'number':
            return isFinite(value);
        case 'string':
            return INTEGER_PATTERN.test(value);

        default:
            return false;
    }
}
