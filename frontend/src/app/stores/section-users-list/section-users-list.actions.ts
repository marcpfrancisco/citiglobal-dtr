import { SortDirection, UserSortables } from '@enums';
import { PaginationResult } from '@interfaces';
import { User } from '@models';
import { createAction, props } from '@ngrx/store';

// User Subject Component
export const onInit = createAction(
    '[Section Users Component] On Init',
    props<{ sectionId: number }>()
);

export const onLoadSectionUsers = createAction(
    '[Section Users Component] On Load Section Users',
    props<{ limit: number; page: number }>()
);

export const onRemoveSectionUser = createAction(
    '[Section Users Component] On Remove Section User',
    props<{ subjectId: number }>()
);

export const onRemoveSectionUserConfirmation = createAction(
    '[Section Users Component] On Remove Section User Confirmation',
    props<{ subjectId: number }>()
);

export const onAddSectionUser = createAction(
    '[Section Users Component] On Add Section Users',
    props<{ subjectId: number }>()
);

export const onToggleSort = createAction(
    '[Section Users Component] On Toggle Sort',
    props<{
        sort: UserSortables | null;
        sortDirection: SortDirection | null;
    }>()
);

// API Actions
export const onLoadSectionUsersSuccess = createAction(
    '[Subjects API] On Load Users Subjects Success',
    props<{ result: PaginationResult<User> }>()
);

export const onLoadSectionUsersFailure = createAction(
    '[Subjects API] On Load Users Subjects Failure',
    props<{ error: Error }>()
);

export const onRemoveSectionUsersSuccess = createAction(
    '[Users API] On Remove Subject Success',
    props<{ id: number }>()
);
export const onRemoveSectionUsersFailure = createAction(
    '[Users API] On Remove Subject Failure',
    props<{ error: Error }>()
);

export const onAddSectionUsersSuccess = createAction(
    '[Users API] On Add User Subject Success',
    props<{ user: User }>()
);
export const onAddSectionUsersFailure = createAction(
    '[Users API] On Add User Subject Failure',
    props<{ error: Error }>()
);
