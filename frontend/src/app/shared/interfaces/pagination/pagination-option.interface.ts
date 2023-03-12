import { SortDirection } from '@enums';

export interface PaginationOption<Sortable extends string = string> {
    page?: number;
    limit?: number;
    search?: string;
    sort?: Sortable;
    sortDirection?: SortDirection;
}
