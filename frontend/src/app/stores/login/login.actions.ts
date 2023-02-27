import { createAction, props } from '@ngrx/store';

export const onInit = createAction('[Login Component] On Init');
export const onLogin = createAction('[Login Component] On Login', props<{email: string, password: string}>());
