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
import * as LogsListReducer from './logs/logs-list.reducer';
import * as LoginReducer from './login/login.reducer';
import * as TimeLogReducer from './time-log/time-log.reducer';
import * as SectionListReducer from './sections/section-list.reducer';
import * as SubjectListReducer from './subjects/subject-list.reducer';
import * as CourseListReducer from './courses/course-list.reducer';
import * as UserSubjectListReducer from './user-subjects-list/user-subject-list.reducer';
import * as SectionUserListReducer from './section-users-list/section-users-list.reducer';
// export reducers here
export {
    AuthenticationReducer,
    CourseListReducer,
    LoginReducer,
    LogsListReducer,
    SectionListReducer,
    SubjectListReducer,
    TimeLogReducer,
    UsersListReducer,
    UserSubjectListReducer,
    SectionUserListReducer,
};

export interface RootState {
    // Add reducer state here
    [AuthenticationReducer.featureKey]: AuthenticationReducer.State;
    [UsersListReducer.featureKey]: UsersListReducer.State;
    [LogsListReducer.featureKey]: LogsListReducer.State;
    [LoginReducer.featureKey]: LoginReducer.State;
    [TimeLogReducer.featureKey]: TimeLogReducer.State;
    [SectionListReducer.featureKey]: SectionListReducer.State;
    [SubjectListReducer.featureKey]: SubjectListReducer.State;
    [CourseListReducer.featureKey]: CourseListReducer.State;
    [UserSubjectListReducer.featureKey]: UserSubjectListReducer.State;
    [SectionUserListReducer.featureKey]: SectionUserListReducer.State;
}

export const ROOT_REDUCERS = new InjectionToken<
    ActionReducerMap<RootState, Action>
>('Root reducer token', {
    factory: () => ({
        // Add reducer state here
        [AuthenticationReducer.featureKey]: AuthenticationReducer.reducer,
        [UsersListReducer.featureKey]: UsersListReducer.reducer,
        [LogsListReducer.featureKey]: LogsListReducer.reducer,
        [LoginReducer.featureKey]: LoginReducer.reducer,
        [TimeLogReducer.featureKey]: TimeLogReducer.reducer,
        [SectionListReducer.featureKey]: SectionListReducer.reducer,
        [SubjectListReducer.featureKey]: SubjectListReducer.reducer,
        [CourseListReducer.featureKey]: CourseListReducer.reducer,
        [UserSubjectListReducer.featureKey]: UserSubjectListReducer.reducer,
        [SectionUserListReducer.featureKey]: SectionUserListReducer.reducer,
    }),
});

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

export const metaReducers: MetaReducer<RootState>[] = [
    resetState,
    storageMetaReducer,
];
