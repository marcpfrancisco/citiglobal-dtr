import { UserSortables, UserRoles, SubjectSortables } from '@enums';
import { ListState, SubjectModel } from '@models';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
    createReducer,
    on,
    createFeatureSelector,
    createSelector,
} from '@ngrx/store';
import { getCurrentTimeStamp, getInitialListState } from '@utils';
import { SubjectListActions } from '.';
import { RootState } from '..';

export const featureKey = 'subject-list';

export interface State
    extends ListState<SubjectSortables>,
        EntityState<SubjectModel> {
    // Add extra properties here...
    updatedAtTimestamp: number;
    search: string;
    filters: {
        subjectCode: string | null;
        periodDateRange: {
            from: Date;
            to: Date;
        };
        isActive: boolean | null;
    };
    hasFilters: boolean;
}

export const adapter = createEntityAdapter<SubjectModel>();

export const initialState = adapter.getInitialState({
    // Add extra properties here...
    ...getInitialListState<SubjectSortables>(),
    updatedAtTimestamp: getCurrentTimeStamp(),
    search: '',
    filters: {
        subjectCode: null,
        isActive: true,
        periodDateRange: {
            from: null,
            to: null,
        },
    },
    hasFilters: false,
});

export const reducer = createReducer(
    initialState,

    on(SubjectListActions.onLoadSubject, (state, { limit, page }) => {
        return { ...state, page, limit };
    }),

    // SEARCH
    on(SubjectListActions.onSearch, (state, { search }) => {
        return { ...state, search, page: 0 }; // reset page when searching
    }),

    // FILTER
    on(SubjectListActions.onApplyFilters, (state, { filters }) => {
        return { ...state, filters, page: 0 }; // reset page when filtering
    }),

    // UPDATE
    on(SubjectListActions.onLoadSubjectsSuccess, (state, { result }) => {
        // Replace current collection with provided collection.
        return adapter.setAll(result.data, state);
    }),

    on(SubjectListActions.onLoadSubjectsSuccess, (state, { result }) => {
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
    on(SubjectListActions.onToggleSort, (state, action) => {
        return {
            ...state,
            sort: action.sort,
            sortDirection: action.sortDirection,
        };
    }),

    on(SubjectListActions.onHasFilters, (state, { hasFilters }) => {
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
        return state.sortIds.reduce<SubjectModel[]>((accumulator, id) => {
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
