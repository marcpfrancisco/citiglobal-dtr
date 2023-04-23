import { UserSortables } from '@enums';
import { PaginationOption } from '@interfaces';

export interface FindAllSectionUsersDto extends PaginationOption {
    name?: string;
    sectionId?: number;
    isActive?: boolean;
    sort?: UserSortables;
}
