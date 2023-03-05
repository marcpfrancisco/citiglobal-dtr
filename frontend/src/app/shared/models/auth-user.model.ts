import { UserRoles } from '../enums/user/user-roles.enum';

export interface AuthUser {
    id: string;
    role: UserRoles;
    token: string;
    username: string;
}
