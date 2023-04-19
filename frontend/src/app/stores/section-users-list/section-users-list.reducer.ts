import { SectionSortables, UserSortables } from '@enums';
import { ListState, Section, User } from '@models';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
    createFeatureSelector,
    createReducer,
    createSelector,
    on,
} from '@ngrx/store';
import { getCurrentTimeStamp, getInitialListState } from '@utils';
import { SectionUserListActions } from '.';
import { RootState } from '..';

export const featureKey = 'section-users-list';

export interface State extends ListState<UserSortables>, EntityState<User> {
    // Add extra properties here...
    updatedAtTimestamp: number;
    sectionId: number;
}

export const adapter = createEntityAdapter<User>();

export const initialState = adapter.getInitialState({
    // Add extra properties here...
    ...getInitialListState<UserSortables>(),
    updatedAtTimestamp: getCurrentTimeStamp(),
    sectionId: null,
});

export const reducer = createReducer(
    initialState,

    on(SectionUserListActions.onInit, (state, { sectionId }) => ({
        ...state,
        sectionId,
    })),

    on(SectionUserListActions.onLoadSectionUsers, (state, { page, limit }) => ({
        ...state,
        page,
        limit,
    })),

    on(SectionUserListActions.onLoadSectionUsersSuccess, (state, { result }) =>
        adapter.setAll(result.data, state)
    ),

    on(
        SectionUserListActions.onLoadSectionUsersSuccess,
        (state, { result }) => {
            // update `sortIds` based on API response
            const ids = result.data.map((item) => item.id);
            return {
                ...state,
                page: result.page,
                total: result.total,
                limit: result.limit,
                sortIds: ids,
            };
        }
    ),

    // SORT
    on(SectionUserListActions.onToggleSort, (state, action) => {
        return {
            ...state,
            sort: action.sort,
            sortDirection: action.sortDirection,
        };
    }),

    on(
        SectionUserListActions.onAddSectionUsersSuccess,
        SectionUserListActions.onRemoveSectionUsersSuccess,
        (state) => ({ ...state, updatedAtTimestamp: getCurrentTimeStamp() })
    )
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
        return state.sortIds.reduce<User[]>((accumulator, id) => {
            if (entities[id]) {
                accumulator.push(entities[id]);
            }
            return accumulator;
        }, []);
    }
);
