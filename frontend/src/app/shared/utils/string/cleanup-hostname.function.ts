import { isString } from 'lodash';

// matches "www." prefix in text. lowercase or uppercase
const WWW_PREFIX_REGEXP = /^www\./gi;

// matches ":[port number]" suffix in text
const PORT_NUMBER_SUFFIX_REGEXP = /:\d+/g;

/**
 * Removes "wwww." prefix and ":[port number]". Then, converts domain/hostname to lowercase.
 *
 * @param {string} hostname - Domain/Host name that we want to cleanup.
 * @returns {string} - normalized clean host/domain name.
 */
export function cleanupHostname(hostname: string): string | void {
  // TODO: testing isString() is unnecessary if there are enough validation of input
  if (!isString(hostname)) {
    return;
  }

  const result = hostname
    .replace(WWW_PREFIX_REGEXP, '')
    .replace(PORT_NUMBER_SUFFIX_REGEXP, '')
    .toLowerCase();

  // empty is invalid!
  if (!result) {
    return;
  }

  return result;
}
