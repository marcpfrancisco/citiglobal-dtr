import { UserSortables, UserRoles, SectionSortables } from '@enums';
import { ListState, Section, User } from '@models';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
    createReducer,
    on,
    createFeatureSelector,
    createSelector,
} from '@ngrx/store';
import { getCurrentTimeStamp, getInitialListState } from '@utils';
import { SectionListActions } from '.';
import { RootState } from '..';

export const featureKey = 'section-list';

export interface State
    extends ListState<SectionSortables>,
        EntityState<Section> {
    // Add extra properties here...
    updatedAtTimestamp: number;
    search: string;
    filters: {
        name: string | null;
        isActive: boolean | null;
    };
    hasFilters: boolean;
}

export const adapter = createEntityAdapter<Section>();

export const initialState = adapter.getInitialState({
    // Add extra properties here...
    ...getInitialListState<SectionSortables>(),
    updatedAtTimestamp: getCurrentTimeStamp(),
    search: '',
    filters: {
        role: null,
        isActive: true,
    },
    hasFilters: false,
});

export const reducer = createReducer(
    initialState,

    on(SectionListActions.onLoadSections, (state, { limit, page }) => ({
        ...state,
        page,
        limit,
    })),

    // SEARCH
    on(SectionListActions.onSearch, (state, { search }) => ({
        ...state,
        search,
        page: 0,
    })),

    // FILTER
    on(SectionListActions.onApplyFilters, (state, { filters }) => ({
        ...state,
        filters,
        page: 0,
    })),

    // UPDATE
    on(SectionListActions.onLoadSectionsSuccess, (state, { result }) => {
        // Replace current collection with provided collection.
        return adapter.setAll(result.data, state);
    }),

    on(SectionListActions.onLoadSectionsSuccess, (state, { result }) => {
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
    on(SectionListActions.onToggleSort, (state, action) => {
        return {
            ...state,
            sort: action.sort,
            sortDirection: action.sortDirection,
        };
    }),

    on(SectionListActions.onHasFilters, (state, { hasFilters }) => {
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
        return state.sortIds.reduce<Section[]>((accumulator, id) => {
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
