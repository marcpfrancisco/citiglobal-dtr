import { SortDirection, SubjectSortables } from '@enums';
import { PaginationResult } from '@interfaces';
import { SubjectModel, User } from '@models';
import { createAction, props } from '@ngrx/store';

// User Subject Component
export const onInit = createAction(
    '[Users Subject Component] On Init',
    props<{ userId: number }>()
);

export const onLoadUsersSubjects = createAction(
    '[Users Subject Component] On Load Users Subject',
    props<{ limit: number; page: number }>()
);

export const onRemoveUserSubject = createAction(
    '[Users Subject Component] On Remove User Subject',
    props<{ subjectId: number }>()
);

export const onRemoveUserSubjectConfirmation = createAction(
    '[Users Subject Component] On Remove User Subject Confirmation',
    props<{ subjectId: number }>()
);

export const onAddUserSubject = createAction(
    '[Users Subject Component] On Add User Subject',
    props<{ subjectId: number }>()
);

export const onToggleSort = createAction(
    '[Users Subject Component] On Toggle Sort',
    props<{
        sort: SubjectSortables | null;
        sortDirection: SortDirection | null;
    }>()
);

// API Actions
export const onLoadUsersSubjectstsSuccess = createAction(
    '[Subjects API] On Load Users Subjects Success',
    props<{ result: PaginationResult<SubjectModel> }>()
);

export const onLoadUsersSubjectsFailure = createAction(
    '[Subjects API] On Load Users Subjects Failure',
    props<{ error: Error }>()
);

export const onRemoveUserSubjectSuccess = createAction(
    '[Users API] On Remove Subject Success',
    props<{ id: number }>()
);
export const onRemoveUserSubjectFailure = createAction(
    '[Users API] On Remove Subject Failure',
    props<{ error: Error }>()
);

export const onAddUserSubjectSuccess = createAction(
    '[Users API] On Add User Subject Success',
    props<{ user: User }>()
);
export const onAddUserSubjectFailure = createAction(
    '[Users API] On Add User Subject Failure',
    props<{ error: Error }>()
);
