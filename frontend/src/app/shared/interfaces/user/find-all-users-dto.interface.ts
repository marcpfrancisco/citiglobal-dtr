import { UserRoles, UserSortables } from '../../enums';
import { PaginationOption } from '../pagination/pagination-option.interface';

import { FindUserDto } from './find-user-dto.interface';

export interface FindAllUsersDto extends FindUserDto, PaginationOption {
  role?: UserRoles;
  roles?: Array<UserRoles>;
  active?: boolean;
  sort?: UserSortables;
  floristIds?: Array<number>;
}
