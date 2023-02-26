import { isNumeric } from './is-numeric.function';

export function numberify<Raw extends number | string | unknown>(
    value: Raw,
    defaultValue?: number
): number {
    // try converting to number
    if (isNumeric<string>(value)) {
        return typeof value === 'string'
            ? parseFloat(value)
            : (value as number);
    }

    // use default value if valid number
    if (isNumeric(defaultValue)) {
        return typeof defaultValue === 'string'
            ? parseFloat(defaultValue)
            : (defaultValue as number);
    }

    // or, use zero
    return 0;
}
