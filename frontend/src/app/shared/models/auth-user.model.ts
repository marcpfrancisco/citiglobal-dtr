import { UserRoles } from '../enums/user/user-roles.enum';
import { SignInUserSession } from './signin-user.session.model';

export interface AuthUser {
    studentId: string;
    signInUserSession: SignInUserSession;
    role: UserRoles;
}
