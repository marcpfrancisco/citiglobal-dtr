import { isString } from 'lodash';
import { SortDirection } from '../../enums';

type SortDataDirection = '' | 'asc' | 'desc' | SortDirection;

export interface GetSortDataOption<SortableType extends string> {
  active: string | SortableType;
  direction: SortDataDirection;
}

export interface GetSortData<SortableType extends string> {
  sort: SortableType;
  sortDirection: SortDirection;
}

export function getSortData<SortableType extends string>({
  active,
  direction,
}: GetSortDataOption<SortableType>): GetSortData<SortableType> {
  switch (isString(direction) && direction.toLocaleLowerCase()) {
    case 'asc':
      return {
        sort: (active as unknown) as SortableType,
        sortDirection: SortDirection.ASC,
      };
    case 'desc':
      return {
        sort: (active as unknown) as SortableType,
        sortDirection: SortDirection.DESC,
      };
    default:
      return { sort: null, sortDirection: null };
  }
}
