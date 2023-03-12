import { TimeLogSortables } from '@enums';
import { ListState, TimeLog } from '@models';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
    createFeatureSelector,
    createReducer,
    createSelector,
    on,
} from '@ngrx/store';
import { getCurrentTimeStamp, getInitialListState } from '@utils';
import { TimeLogActions } from '.';
import { RootState } from '..';

export const featureKey = 'time-log';

export interface State
    extends ListState<TimeLogSortables>,
        EntityState<TimeLog> {
    // Add extra properties here...
    updatedAtTimestamp: number;
    search: string;
    filters: {
        periodDateRange: {
            from: Date;
            to: Date;
        };
    };
    timeLog: {
        rfidNo: string;
        timeIn: string | Date;
        timeOut: string | Date;
        timeRendered: string | Date;
    };
    hasFilters: false;
}

export const adapter = createEntityAdapter<TimeLog>();

export const initialState = adapter.getInitialState({
    // Add extra properties here...
    ...getInitialListState<TimeLogSortables>(),
    updatedAtTimestamp: getCurrentTimeStamp(),
    search: '',
    filters: {
        periodDateRange: {
            from: null,
            to: null,
        },
    },
    timeLog: {
        rfidNo: null,
        timeIn: null,
        timeOut: null,
        timeRendered: null,
    },
    hasFilters: false,
});

export const reducer = createReducer(
    initialState,

    // SEARCH RFID
    on(TimeLogActions.onSearchRFID, (state, { rfidNo }) => {
        return { ...state, rfidNo }; // reset page when searching
    }),

    // TIME LOG SUCCESS
    on(TimeLogActions.onTimeLogSuccess, (state, { result }) => {
        const { user, timeIn, timeOut, timeRendered } = result;

        return {
            ...state,
            timeLog: {
                rfidNo: user?.rfidNo,
                timeIn,
                timeOut,
                timeRendered,
            },
        };
    }),

    on(TimeLogActions.onClearTimeLogField, (state) => ({
        ...state,
        rfidNo: null,
    }))
);

// Selectors
export const selectState = createFeatureSelector<RootState, State>(featureKey);

export const { selectIds, selectEntities, selectAll, selectTotal } =
    adapter.getSelectors(selectState);

export const selectRFIDNo = createSelector(
    selectState,
    (state) => state.timeLog.rfidNo
);

export const clearRFIDNo = createSelector(selectState, (state) => {
    const rfidNo = state.timeLog.rfidNo;
    return rfidNo ? null : rfidNo;
});
