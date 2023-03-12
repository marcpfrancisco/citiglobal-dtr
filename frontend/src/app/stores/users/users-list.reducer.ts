import { UserSortables, UserRoles } from '@enums';
import { ListState, User } from '@models';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
    createReducer,
    on,
    createFeatureSelector,
    createSelector,
} from '@ngrx/store';
import { getCurrentTimeStamp, getInitialListState } from '@utils';
import { UsersListActions } from '.';
import { RootState } from '..';
import { AuthenticationActions } from '../authentication';

export const featureKey = 'users-list';

export interface State extends ListState<UserSortables>, EntityState<User> {
    // Add extra properties here...
    updatedAtTimestamp: number;
    search: string;
    filters: {
        role: UserRoles | null;
        isActive: boolean | null;
        withDeleted: boolean | null;
    };
    hasFilters: boolean;
}

export const adapter = createEntityAdapter<User>();

export const initialState = adapter.getInitialState({
    // Add extra properties here...
    ...getInitialListState<UserSortables>(),
    updatedAtTimestamp: getCurrentTimeStamp(),
    search: '',
    filters: {
        role: null,
        isActive: null,
        withDeleted: false,
    },
    hasFilters: false,
});

export const reducer = createReducer(
    initialState,
    on(UsersListActions.onLoadUsers, (state, { limit, page }) => {
        return { ...state, page, limit };
    }),

    // SEARCH
    on(UsersListActions.onSearch, (state, { search }) => {
        return { ...state, search, page: 0 }; // reset page when searching
    }),

    // FILTER
    on(UsersListActions.onApplyFilters, (state, { filters }) => {
        return { ...state, filters, page: 0 }; // reset page when filtering
    }),

    // UPDATE
    on(UsersListActions.onLoadUsersSuccess, (state, { result }) => {
        // Replace current collection with provided collection.
        return adapter.setAll(result.data, state);
    }),
    on(UsersListActions.onLoadUsersSuccess, (state, { result }) => {
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
    on(AuthenticationActions.onUpdateCurrentUserSuccess, (state, { user }) => {
        // Replace current collection with provided collection.
        return adapter.updateOne({ id: user.id, changes: { ...user } }, state);
    }),

    // SORT
    on(UsersListActions.onToggleSort, (state, action) => {
        return {
            ...state,
            sort: action.sort,
            sortDirection: action.sortDirection,
        };
    }),

    on(
        AuthenticationActions.onUpdateCurrentUserSuccess,
        UsersListActions.onCreateUserSuccess,
        UsersListActions.onUpdateUserSuccess,
        UsersListActions.onDeleteUserSuccess,
        UsersListActions.onUndeleteUserSuccess,
        UsersListActions.onResetPasswordUserSuccess,
        (state) => {
            // Replace current collection with provided collection.
            return {
                ...state,
                updatedAtTimestamp: getCurrentTimeStamp(),
            };
        }
    ),

    on(UsersListActions.onHasFilters, (state, { hasFilters }) => {
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
        return state.sortIds.reduce<User[]>((accumulator, id) => {
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
