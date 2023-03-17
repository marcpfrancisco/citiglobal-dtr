import { AuthUser } from '@models';
import { createAction, props } from '@ngrx/store';

// User Actions
export const onLogin = createAction(
    '[Admin Login Component] On Login',
    props<{ email: string; password: string }>()
);

export const onAdminLoginInit = createAction(
    '[Admin Login Component] Admin Login On Init'
);
export const onTimeLogLoginInit = createAction(
    '[Time Log Login Component] Time Log On Init'
);

export const onTimeLogLogin = createAction(
    '[Admin Login Component] Login by User Id',
    props<{ studentNo: number }>()
);

// API Actions
export const onLogInSuccess = createAction(
    '[Authentication API] On Log In Success',
    props<{ user: AuthUser }>()
);
export const onLogInFailure = createAction(
    '[Authentication API] On Log In Failure',
    props<{ error: any }>()
);

export const onTimeLogLoginSuccess = createAction(
    '[Admin Login Component] Login by User Id Success',
    props<{ result: any }>()
);
export const onTimeLogLoginFailure = createAction(
    '[Admin Login Component] Login by User Id Failure',
    props<{ error: Error }>()
);
