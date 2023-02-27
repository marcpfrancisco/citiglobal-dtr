import { SortDirection } from '../enums';


export interface ListState<SortableType = string> {
  nopage?: string | null;
  page: number | null;
  total: number | null;
  limit: number | null;
  sort: string & SortableType | null;
  sortDirection: SortDirection | null;
  sortIds: Array<number | string>;
  pageSizeOptions: number[] | null;
  search?: string;
}

export interface ListStateParam<SortableType = string> {
  nopage?: string | null;
  page?: number;
  total?: number;
  limit?: number;
  sort?: string & SortableType;
  sortDirection?: SortDirection;
  search?: string;
}
