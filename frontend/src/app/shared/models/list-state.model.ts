import { SortDirection } from '../enums';

export interface ListState<SortableType = string> {
    page: number | null;
    total: number | null;
    limit: number | null;
    sort: (string & SortableType) | null;
    sortDirection: SortDirection | null;
    sortIds: Array<number | string>;
    pageSizeOptions: number[] | null;
    search?: string;
}

export interface ListStateParam<SortableType = string> {
    page?: number;
    total?: number;
    limit?: number;
    sort?: string & SortableType;
    sortDirection?: SortDirection;
    search?: string;
}
