import { TimeLog } from '@models';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
    createFeatureSelector,
    createReducer,
    createSelector,
    on,
} from '@ngrx/store';
import { TimeLogActions } from '.';
import { RootState } from '..';

export const featureKey = 'time-log';

export interface State extends EntityState<TimeLog> {
    rfidNo: string;
    time_in: string | Date;
    time_out: string | Date;
    time_rendered: string | Date;
}

export const adapter = createEntityAdapter<TimeLog>();

export const initialState = adapter.getInitialState({
    // Add extra properties here...
    rfidNo: null,
    time_in: null,
    time_out: null,
    time_rendered: null,
});

export const reducer = createReducer(
    initialState,

    on(TimeLogActions.onSearchRFID, (state, { rfidNo }) => ({
        ...state,
        rfidNo,
    }))
);

// Selectors
export const selectState = createFeatureSelector<RootState, State>(featureKey);

export const { selectIds, selectEntities, selectAll, selectTotal } =
    adapter.getSelectors(selectState);

export const selectRFIDNo = createSelector(
    selectState,
    (state) => state.rfidNo
);
