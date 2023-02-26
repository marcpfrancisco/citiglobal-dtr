import { InjectionToken } from '@angular/core';
import {
    ActionReducerMap,
    Action,
    ActionReducer,
    MetaReducer,
} from '@ngrx/store';

// Import reducers here...
import * as AuthenticationReducer from './authentication/authentication.reducer';

// export reducers here
export { AuthenticationReducer };

export interface RootState {
    // Add reducer state here
    [AuthenticationReducer.featureKey]: AuthenticationReducer.State;
}

export const ROOT_REDUCERS = new InjectionToken<
    ActionReducerMap<RootState, Action>
>('Root reducer token', {
    factory: () => ({
        // Add reducer state here
        [AuthenticationReducer.featureKey]: AuthenticationReducer.reducer,
    }),
});
