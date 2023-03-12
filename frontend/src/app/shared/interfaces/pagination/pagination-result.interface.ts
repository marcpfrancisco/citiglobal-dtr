export interface PaginationResult<Entity> {
    data: Entity[];
    page: number;
    limit: number;
    total: number;
    filters?: any;
}
