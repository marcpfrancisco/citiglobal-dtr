import { TimeLogSortables, UserRoles } from '@enums';
import { ListState, TimeLog, User } from '@models';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
    createFeatureSelector,
    createReducer,
    createSelector,
    on,
} from '@ngrx/store';
import { getCurrentTimeStamp, getInitialListState } from '@utils';

import { LogsListActions } from '.';
import { RootState } from '..';

export const featureKey = 'time-log-list';

export interface State
    extends ListState<TimeLogSortables>,
        EntityState<TimeLog> {
    // Add extra properties here...
    updatedAtTimestamp: number;
    search: string;
    filters: {
        role: UserRoles | null;
        active: boolean | null;
        withDeleted: boolean | null;
    };
    hasFilters: boolean;
}

export const adapter = createEntityAdapter<TimeLog>();

export const initialState = adapter.getInitialState({
    // Add extra properties here...
    ...getInitialListState<TimeLogSortables>(),
    updatedAtTimestamp: getCurrentTimeStamp(),
    search: '',
    filters: {
        role: null,
        active: null,
        withDeleted: false,
    },
    hasFilters: false,
});

export const reducer = createReducer(
    initialState,
    on(LogsListActions.onLoadTimeLogs, (state, { limit, page }) => {
        return { ...state, page, limit };
    }),

    // SEARCH
    on(LogsListActions.onSearch, (state, { search }) => {
        return { ...state, search, page: 0 }; // reset page when searching
    }),

    // FILTER
    on(LogsListActions.onApplyFilters, (state, { filters }) => {
        return { ...state, filters, page: 0 }; // reset page when filtering
    }),

    // UPDATE
    on(LogsListActions.onLoadLogsSuccess, (state, { result }) => {
        // Replace current collection with provided collection.
        return adapter.setAll(result.data, state);
    }),
    on(LogsListActions.onLoadLogsSuccess, (state, { result }) => {
        // update `sortIds` based on API response
        const ids = result.data.map((item) => item.id);
        return {
            ...state,
            page: result.page,
            total: result.total,
            limit: result.limit,
            sortIds: ids,
        };
    }),

    // SORT
    on(LogsListActions.onToggleSort, (state, action) => {
        return {
            ...state,
            sort: action.sort,
            sortDirection: action.sortDirection,
        };
    }),

    on(LogsListActions.onCreateLogSuccess, (state) => {
        // Replace current collection with provided collection.
        return {
            ...state,
            updatedAtTimestamp: getCurrentTimeStamp(),
        };
    }),

    on(LogsListActions.onHasFilters, (state, { hasFilters }) => {
        return {
            ...state,
            hasFilters,
        };
    })
);

// Selectors
export const selectState = createFeatureSelector<RootState, State>(featureKey);

export const { selectIds, selectEntities, selectAll, selectTotal } =
    adapter.getSelectors(selectState);

export const selectList = createSelector(
    selectState,
    selectEntities,
    (state, entities) => {
        // use `sortIds` as basis for the sort order of items
        return state.sortIds.reduce<TimeLog[]>((accumulator, id) => {
            if (entities[id]) {
                accumulator.push(entities[id]);
            }
            return accumulator;
        }, []);
    }
);

export const selectHasFilters = createSelector(
    selectState,
    (state) => state.hasFilters
);

export const selectUpdatedAt = createSelector(
    selectState,
    (state) => state.updatedAtTimestamp
);
