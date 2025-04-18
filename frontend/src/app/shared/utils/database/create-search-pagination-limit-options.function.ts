import { isObjectLike, isString } from 'lodash';
import { SearchPaginationLimitOptions } from './create-search-pagination-limit-options.type';

const SEARCH_CHARACTER_LENGTH_LIMITS = [
    {
        length: 0,
        limit: 50,
    },
    {
        length: 1,
        limit: 100,
    },
    {
        length: 2,
        limit: 150,
    },
    {
        length: 3,
        limit: 200,
    },
];

export function createSearchPaginationLimitOptions(
    options: SearchPaginationLimitOptions
): SearchPaginationLimitOptions {
    if (!isObjectLike(options)) {
        return {};
    }

    const optionKeys = Object.keys(options);
    const { search, limit, ...partialOptions } = options;
    const length = isString(search) ? search.length : 0;

    // find limit that matches search keyword character length
    const paginationLimit =
        SEARCH_CHARACTER_LENGTH_LIMITS.find(
            ({ length: charLength }) => length === charLength
        )?.limit || false;

    return {
        ...partialOptions,

        // reinstate search filter if it exists
        ...(optionKeys.includes('search') ? { search } : {}),

        ...(paginationLimit !== false
            ? // mandate limit here and remove nopage if search character is less than 3
              {
                  page: 0,
                  limit: paginationLimit,
              }
            : // reapply passed parameters
              {
                  ...(optionKeys.includes('limit') ? { limit } : {}),
              }),
    };
}
