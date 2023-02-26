import { UserRoles } from '../../enums/user/user.roles.enum';

export interface CreateUserDto {
  name: string;

  username: string;

  role: UserRoles;

  email: string;
}
