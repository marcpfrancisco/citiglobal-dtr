import { UserRoles } from '@enums';

export interface CreateUserDto {
    name: string;

    username: string;

    role: UserRoles;

    email: string;
}
