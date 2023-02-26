import { NUMBER_PATTERN } from './number.constant';

export function isNumeric<ExpectedType>(
  value: ExpectedType | unknown
): value is ExpectedType {
  switch (typeof value) {
    case 'number':
      return isFinite(value);
    case 'string':
      return NUMBER_PATTERN.test(value);

    default:
      return false;
  }
}
