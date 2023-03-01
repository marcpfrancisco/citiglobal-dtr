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
    isAdmin: boolean;
    signInUserSession: SignInUserSession | null;
    currentUser: User | null;
}

export const initialState: State = {
    signInUserSession: null,
    currentUser: null,
    isAdmin: false,
};

export const reducer = createReducer(
    initialState,
    // on(
    //     AuthenticationActions.onLogInSuccess,
    //     AuthenticationActions.onCurrentSignInUserSessionSuccess,
    //     (state, { user }) => ({
    //         ...state,
    //         signInUserSession: user.signInUserSession,
    //         isAdmin: user.isAdmin === true,
    //     })
    // ),
    on(AuthenticationActions.onLogInSuccess, (state, { user }) => ({
        ...state,

        isAdmin: user.role === 'superadmin' ? true : false,
    })),
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
