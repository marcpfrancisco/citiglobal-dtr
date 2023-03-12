export type SearchPaginationLimitOptions = {
    search?: string;
    limit?: number;
} & {
    [key in string | number]?: unknown;
};
