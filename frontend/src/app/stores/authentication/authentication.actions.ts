import { EditUserDto } from '@interfaces';
import { AuthUser, User } from '@models';
import { createAction, props } from '@ngrx/store';

// Toolbar Actions
export const onLogout = createAction('[Toolbar Component] On Logout');

// API Actions
export const onLogInSuccess = createAction(
    '[Authentication API] On Log In Success',
    props<{ user: AuthUser }>()
);
export const onLogInFailure = createAction(
    '[Authentication API] On Log In Failure',
    props<{ error: any }>()
);
export const onLogOutSuccess = createAction(
    '[Authentication API] On Log Out Success'
);
export const onLogOutFailure = createAction(
    '[Authentication API] On Log Out Failure',
    props<{ error: any }>()
);
export const onCurrentSignInUserSessionSuccess = createAction(
    '[Authentication API] On Current Sign In User Session Success',
    props<{ user: AuthUser }>()
);
export const onCurrentSignInUserSessionFailure = createAction(
    '[Authentication API] On Current Sign In User Session Failure',
    props<{ error: any }>()
);
export const onForgotPasswordSuccess = createAction(
    '[Authentication API] On Forgot Password Success',
    props<{ result: any }>()
);
export const onForgotPasswordFailure = createAction(
    '[Authentication API] On Forgot Password Failure',
    props<{ error: any }>()
);
export const onForgotPasswordSubmitSuccess = createAction(
    '[Authentication API] On Forgot Password Submit Success',
    props<{ result: any }>()
);
export const onForgotPasswordSubmitFailure = createAction(
    '[Authentication API] On Forgot Password Submit Failure',
    props<{ error: any }>()
);

// Recover Password Actions
export const onForgotPassword = createAction(
    '[Forgot Password Component] On Forgot Password',
    props<{ email: string }>()
);

// Load Current/Logged In User Profile
export const onLoadCurrentUser = createAction(
    '[App Component] On Load Current User'
);

export const onLoadCurrentUserSuccess = createAction(
    '[Authentication API] On Load Current User Success',
    props<{ user: User; isLogin?: boolean }>()
);

export const onLoadCurrentUserFailure = createAction(
    '[Authentication API] On Load Current User Failure',
    props<{ error: any; isLogin?: boolean }>()
);

// Update Current/Logged In User Profile
export const onUpdateCurrentUser = createAction(
    '[Toolbar Component] On Update Current User',
    props<{ partialUser: EditUserDto }>()
);

export const onUpdateCurrentUserSuccess = createAction(
    '[Authentication API] On Update Current User Success',
    props<{ user: User }>()
);
export const onUpdateCurrentUserFailure = createAction(
    '[Authentication API] On Update Current User Failure',
    props<{ error: any }>()
);

// Reset Current User Password
export const onResetCurrentUserPassword = createAction(
    '[Profile Component] On Reset Current User Password'
);
export const onChangePasswordSuccess = createAction(
    '[Users API] On Change Password Success'
);
export const onChangePasswordFailure = createAction(
    '[Users API] On Change Password Failure',
    props<{ error: any }>()
);
export const onConfirmChangePasswordSuccessAlert = createAction(
    '[Alert Component] On Confirm Change Password Success Alert'
);

// Force Logout
export const onForceLogout = createAction('[App] On Force Logout');

// Update Ability
export const onRefreshAbility = createAction(
    '[App Component] On Refresh Ability'
);
