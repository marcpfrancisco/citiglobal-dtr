import { SignInUserSession } from './signin-user.session.model';

export interface AuthUser {
    studentId: string;
    signInUserSession: SignInUserSession;
    isAdmin: boolean | null;
}
