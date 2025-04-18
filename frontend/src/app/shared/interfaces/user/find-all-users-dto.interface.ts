import { UserRoles, UserSortables } from '@enums';
import { PaginationOption } from '@interfaces';

import { FindUserDto } from './find-user-dto.interface';

export interface FindAllUsersDto extends FindUserDto, PaginationOption {
    role?: UserRoles;
    roles?: Array<UserRoles>;
    sectionId?: number;
    isActive?: boolean;
    sort?: UserSortables;
}
