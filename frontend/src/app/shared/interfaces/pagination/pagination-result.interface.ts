/** add other filters here separated by pipe eg. Sections | Subjects | Students | NewFilters */
// type Filters = ProductFilters;

export interface PaginationResult<Entity> {
    data: Entity[];
    page: number;
    limit: number;
    total: number;
    filters?: any;
}
