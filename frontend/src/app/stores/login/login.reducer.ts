import {
    createReducer,
    on,
    createFeatureSelector,
    createSelector,
} from '@ngrx/store';
import { AuthenticationActions } from '../authentication';
import { LoginActions } from '.';
import { RootState } from '..';

export const featureKey = 'login';

export interface State {
    loginButtonDisabled: boolean;
}

export const initialState: State = {
    loginButtonDisabled: false,
};

export const reducer = createReducer(
    initialState,
    // Add `on()` call events here...
    on(LoginActions.onLogin, (state) => {
        return { ...state, loginButtonDisabled: true };
    }),
    on(
        LoginActions.onAdminLoginInit,
        AuthenticationActions.onAdminLogInSuccess,
        AuthenticationActions.onAdminLoginFailure,
        (state) => {
            return { ...state, loginButtonDisabled: false };
        }
    )
);

// Selectors
export const selectLoginComponentState = createFeatureSelector<
    RootState,
    State
>(featureKey);
export const selectLoginButtonDisabled = createSelector(
    selectLoginComponentState,
    (state) => state.loginButtonDisabled
);
