import { InjectionToken } from '@angular/core';
import { ActionReducerMap, Action } from '@ngrx/store';

export interface RootState {}

export const ROOT_REDUCERS = new InjectionToken<
    ActionReducerMap<RootState, Action>
>('Root reducer token', {
    factory: () => ({}),
});
