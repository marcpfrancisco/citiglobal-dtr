export type SearchPaginationLimitOptions = {
  search?: string;
  limit?: number;
  nopage?: 'true' | 'false';
} & {
  [key in string | number]?: unknown;
};
