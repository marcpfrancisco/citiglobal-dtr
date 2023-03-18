import { SubjectSortables } from '@enums';
import { ListState, SubjectModel } from '@models';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
    createFeatureSelector,
    createReducer,
    createSelector,
    on,
} from '@ngrx/store';
import { getInitialListState } from '@utils';
import { UserSubjectListActions } from '.';
import { RootState } from '..';

export const featureKey = 'users-subject-list';

export interface State
    extends ListState<SubjectSortables>,
        EntityState<SubjectModel> {
    // Add extra properties here...
    userId: number;
}

export const adapter = createEntityAdapter<SubjectModel>();

export const initialState = adapter.getInitialState({
    // Add extra properties here...
    ...getInitialListState<SubjectSortables>(),
    userId: null,
});

export const reducer = createReducer(
    initialState,

    on(UserSubjectListActions.onInit, (state, { userId }) => ({
        ...state,
        userId,
    })),

    on(
        UserSubjectListActions.onLoadUsersSubjects,
        (state, { page, limit }) => ({ ...state, page, limit })
    ),

    on(
        UserSubjectListActions.onLoadUsersSubjectstsSuccess,
        (state, { result }) => adapter.setAll(result.data, state)
    ),

    on(
        UserSubjectListActions.onLoadUsersSubjectstsSuccess,
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
    on(UserSubjectListActions.onToggleSort, (state, action) => {
        return {
            ...state,
            sort: action.sort,
            sortDirection: action.sortDirection,
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
