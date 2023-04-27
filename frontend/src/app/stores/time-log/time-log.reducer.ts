import { TimeLogSortables } from '@enums';
import { ListState, TimeLog, User } from '@models';
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
    rfidNo: string;
    filters: {
        periodDateRange: {
            from: Date;
            to: Date;
        };
    };
    user: User;
    timeIn: string;
    timeOut: string;
    hasFilters: boolean;
}

export const adapter = createEntityAdapter<TimeLog>();

export const initialState = adapter.getInitialState({
    // Add extra properties here...
    ...getInitialListState<TimeLogSortables>(),
    updatedAtTimestamp: getCurrentTimeStamp(),
    rfidNo: '',
    filters: {
        periodDateRange: {
            from: null,
            to: null,
        },
    },
    user: null,
    timeIn: null,
    timeOut: null,
    hasFilters: false,
});

export const reducer = createReducer(
    initialState,

    // SEARCH RFID
    on(TimeLogActions.onSearchRFID, (state, { rfidNo }) => {
        return { ...state, rfidNo };
    }),

    // TIME LOG SUCCESS
    on(TimeLogActions.onTimeLogSuccess, (state, { timeLog }) => {
        const { user, timeIn, timeOut } = timeLog;

        return {
            ...state,
            rfidNo: user?.rfidNo,
            timeIn,
            timeOut,
            user,
        };
    }),

    on(TimeLogActions.onShowTimeLogIDSuccess, (state, { user }) => ({
        ...state,
        user,
    }))
);

// Selectors
export const selectState = createFeatureSelector<RootState, State>(featureKey);

export const { selectIds, selectEntities, selectAll, selectTotal } =
    adapter.getSelectors(selectState);

export const selectCurrentRfidValue = createSelector(
    selectState,
    (state) => state.rfidNo
);

export const selectUser = createSelector(selectState, (state) => state.user);
