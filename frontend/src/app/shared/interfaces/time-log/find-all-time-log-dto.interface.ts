import { TimeLogSortables, UserRoles } from '@enums';
import { PaginationOption } from '@interfaces';

export interface FindAllTimeLogDto extends PaginationOption {
    rfidNo?: string | number;
    userId?: number;
    role?: UserRoles | string;
    sort?: TimeLogSortables;
}
