import { InjectionToken } from '@angular/core';
import {
    Action,
    ActionReducer,
    ActionReducerMap,
    MetaReducer,
} from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { AuthenticationActions } from './authentication';

// Import reducers here...
import * as AuthenticationReducer from './authentication/authentication.reducer';
import * as UsersListReducer from './users/users-list.reducer';
import * as LoginReducer from './login/login.reducer';
// export reducers here
export { AuthenticationReducer, UsersListReducer, LoginReducer };

export interface RootState {
    // Add reducer state here
    [AuthenticationReducer.featureKey]: AuthenticationReducer.State;
    [UsersListReducer.featureKey]: UsersListReducer.State;
    [LoginReducer.featureKey]: LoginReducer.State;
}

export const ROOT_REDUCERS = new InjectionToken<
    ActionReducerMap<RootState, Action>
>('Root reducer token', {
    factory: () => ({
        // Add reducer state here
        [AuthenticationReducer.featureKey]: AuthenticationReducer.reducer,
        [UsersListReducer.featureKey]: UsersListReducer.reducer,
        [LoginReducer.featureKey]: LoginReducer.reducer,
    }),
});

export function localStorageSyncReducer(
    reducer: ActionReducer<any>
): ActionReducer<any> {
    return localStorageSync({
        keys: [
            // add the store keys for syncing to localStorage
            AuthenticationReducer.featureKey,
        ],
        rehydrate: true, // Pull initial state from local storage on startup
    })(reducer);
}

export function storageMetaReducer(
    reducer: ActionReducer<any>
): ActionReducer<any, any> {
    return localStorageSyncReducer(reducer);
}

// Reset State on LogOutSuccess
export function resetState(reducer: ActionReducer<any>): ActionReducer<any> {
    return (state, action) =>
        reducer(
            action.type === AuthenticationActions.onLogOutSuccess.type
                ? undefined
                : state,
            action
        );
}

export const metaReducers: MetaReducer<RootState>[] = [
    resetState,
    storageMetaReducer,
];
