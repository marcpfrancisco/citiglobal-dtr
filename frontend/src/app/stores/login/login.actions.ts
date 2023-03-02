import { createAction, props } from '@ngrx/store';

// User Actions
export const onAdminLoginInit = createAction(
    '[Admin Login Component] Admin Login On Init'
);
export const onTimeLogLoginInit = createAction(
    '[Time Log Login Component] Time Log On Init'
);

export const onLoginByStudentId = createAction(
    '[Admin Login Component] Login by Student Id',
    props<{ studentId: string | number }>()
);

export const onTimeLogLogin = createAction(
    '[Admin Login Component] Login by User Id',
    props<{ id: string | number }>()
);

// API Actions
export const onLoginByStudentIdSuccess = createAction(
    '[Admin Login Component] Login by Student Id Success',
    props<{ result: any }>()
);
export const onLoginByStudentIdFailure = createAction(
    '[Admin Login Component] Login by Student Id Failure',
    props<{ error: Error }>()
);

export const onTimeLogLoginSuccess = createAction(
    '[Admin Login Component] Login by User Id Success',
    props<{ result: any }>()
);
export const onTimeLogLoginFailure = createAction(
    '[Admin Login Component] Login by User Id Failure',
    props<{ error: Error }>()
);
