import { UserRoles } from '@enums';
import { User } from '@models';
import {
    createFeatureSelector,
    createReducer,
    createSelector,
    on,
} from '@ngrx/store';

import { AuthenticationActions } from '.';
import { RootState } from '..';

export const featureKey = 'authentication';

export interface State {
    id: string;
    token: string;
    role: UserRoles;
    currentUser: User | null;
}

export const initialState: State = {
    id: null,
    token: null,
    role: null,
    currentUser: null,
};

export const reducer = createReducer(
    initialState,
    on(
        AuthenticationActions.onAdminLogInSuccess,
        AuthenticationActions.onCurrentSignInUserSessionSuccess,
        (state, { user }) => ({
            ...state,
            id: user.id,
            token: user.token,
            role: user.role,
        })
    ),
    on(
        AuthenticationActions.onLoadCurrentUserSuccess,
        AuthenticationActions.onUpdateCurrentUserSuccess,
        (state, { user }) => ({ ...state, currentUser: user[0] })
    )
);

// Selectors
export const selectAuthenticationState = createFeatureSelector<
    RootState,
    State
>(featureKey);

export const selectUserId = createSelector(
    selectAuthenticationState,
    (state) => state.id
);

export const selectCurrentUser = createSelector(
    selectAuthenticationState,
    (state) => state.currentUser
);
