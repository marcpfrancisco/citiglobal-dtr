import { CourseSortables } from '@enums';
import { Course, ListState } from '@models';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
    createFeatureSelector,
    createReducer,
    createSelector,
    on,
} from '@ngrx/store';
import { getInitialListState, getCurrentTimeStamp } from '@utils';
import { CourseListActions } from '.';
import { RootState } from '..';

export const featureKey = 'course-list';

export interface State extends ListState<CourseSortables>, EntityState<Course> {
    // add additional properties here
    updatedAtTimestamp: number;
    search: string;
    filters: {
        name: string | null;
        isActive: boolean | null;
    };
    hasFilters: boolean;
}

export const adapter = createEntityAdapter<Course>();

export const initialState = adapter.getInitialState({
    // Add extra properties here...
    ...getInitialListState<CourseSortables>(),
    updatedAtTimestamp: getCurrentTimeStamp(),
    search: '',
    filters: {
        name: null,
        isActive: true,
    },
    hasFilters: true,
});

export const reducer = createReducer(
    initialState,

    on(CourseListActions.onLoadCourses, (state, { limit, page }) => ({
        ...state,
        page,
        limit,
    })),

    // UPDATE
    on(CourseListActions.onLoadCoursesSuccess, (state, { result }) => {
        // Replace current collection with provided collection.
        return adapter.setAll(result.data, state);
    }),

    on(CourseListActions.onLoadCoursesSuccess, (state, { result }) => {
        // update `sortIds` based on API response
        const ids = result.data.map((item) => item.id);
        return {
            ...state,
            page: result.page,
            total: result.total,
            limit: result.limit,
            sortIds: ids,
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
        return state.sortIds.reduce<Course[]>((accumulator, id) => {
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
