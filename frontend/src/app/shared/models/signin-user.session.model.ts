import { UserRoles } from '../enums/user/user-roles.enum';

export interface SignInUserSession {
    token: string;
    id: string | number;
    role: UserRoles;
}
