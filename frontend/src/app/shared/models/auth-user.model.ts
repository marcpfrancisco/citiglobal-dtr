import { UserRoles } from '../enums/user/user-roles.enum';

export interface AuthUser {
    id: number;
    role: UserRoles;
    token: string;
    username: string;
}
