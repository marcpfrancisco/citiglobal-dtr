import { UserRoles } from '../../enums/user/user.roles.enum';

export interface EditUserDto {
  name?: string;

  role?: UserRoles;

  email?: string;

  active?: boolean;

  deletedAt?: null;
}
