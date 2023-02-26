import { camelCase, capitalize, isNumber, isString } from 'lodash';

const CAPITALIZED_REGEXP = /[A-Z]/g;

export function createSpaceDelimitedWords(words: string): string {
  if (!isString(words) && !isNumber(words)) {
    return '';
  }

  return capitalize(camelCase(`${words}`).replace(CAPITALIZED_REGEXP, ' $&'));
}
