import { UserRoles } from '../enums/user/user-roles.enum';

export interface SignInUserSession {
    token: string;
    userId: string;
    roles: Array<UserRoles>;
}
