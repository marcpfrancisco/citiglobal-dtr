import { SignInUserSession, User } from '@models';
import {
    createReducer,
    on,
    createFeatureSelector,
    createSelector,
} from '@ngrx/store';

import { AuthenticationActions } from '.';
import { RootState } from '..';

export const featureKey = 'authentication';

export interface State {
    changePasswordRequired: boolean;
    signInUserSession: SignInUserSession | null;
    currentUser: User | null;
}

export const initialState: State = {
    signInUserSession: null,
    currentUser: null,
    changePasswordRequired: false,
};

export const reducer = createReducer(
    initialState,
    on(
        AuthenticationActions.onLogInSuccess,
        AuthenticationActions.onCurrentSignInUserSessionSuccess,
        (state, { user }) => ({
            ...state,
            signInUserSession: user.signInUserSession,
            changePasswordRequired:
                user.challengeName === 'NEW_PASSWORD_REQUIRED',
        })
    ),
    on(
        AuthenticationActions.onLoadCurrentUserSuccess,
        AuthenticationActions.onUpdateCurrentUserSuccess,
        (state, { user }) => ({ ...state, currentUser: user })
    )
);

// Selectors
export const selectAuthenticationState = createFeatureSelector<
    RootState,
    State
>(featureKey);

export const selectSignInUserSession = createSelector(
    selectAuthenticationState,
    (state) => state.signInUserSession
);

export const selectCurrentUser = createSelector(
    selectAuthenticationState,
    (state) => state.currentUser
);
