import { TimeLogSortables, UserRoles } from '@enums';
import { PaginationOption } from '@interfaces';

export interface FindAllTimeLogDto extends PaginationOption {
    role?: UserRoles;
    roles?: Array<UserRoles>;
    isActive?: boolean;
    sort?: TimeLogSortables;
}
