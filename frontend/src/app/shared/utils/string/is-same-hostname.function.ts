import { isString } from 'lodash';

export function isSameHostname(url1: string, url2: string): boolean {
  const hostname1 = isString(url1) && new URL(url1).hostname;
  const hostname2 = isString(url2) && new URL(url2).hostname;

  if (!hostname1 || !hostname2) {
    return false;
  }

  return hostname1 === hostname2;
}
