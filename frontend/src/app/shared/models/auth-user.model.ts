import { SignInUserSession } from './signin-user.session.model';

export interface AuthUser {
    username: string;
    signInUserSession: SignInUserSession;
    isAdmin: boolean | null;
}
