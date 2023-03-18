import { PaginationResult } from '@interfaces';
import { Course } from '@models';
import { createAction, props } from '@ngrx/store';

// Section List Component
export const onInit = createAction('[Section Edit Component] On Init');

export const onLoadCourses = createAction(
    '[Section Edit Component] On Load Courses',
    props<{ limit: number; page: number }>()
);

// API Actions
export const onLoadCoursesSuccess = createAction(
    '[Courses API] On Load Courses Success',
    props<{ result: PaginationResult<Course> }>()
);
export const onLoadCoursesFailure = createAction(
    '[Courses API] On Load Courses Failure',
    props<{ error: any }>()
);
