
import { UserSortables, SortDirection } from '@enums';
import { CreateUserDto, EditUserDto, PaginationResult } from '@interfaces';
import { User } from '@models';
import { createAction, props } from '@ngrx/store';

// Users List Component
export const onInit = createAction('[Users List Component] On Init');

export const onLoadUsers = createAction(
  '[Users List Component] On Load Users',
  props<{ limit: number; page: number }>()
);
export const onSearch = createAction(
  '[Users List Component] On Search',
  props<{ search: string }>()
);
export const onShowFilters = createAction(
  '[Users List Component] On Show Filters'
);
export const onApplyFilters = createAction(
  '[Users List Component] On Apply Filters',
  props<{ filters: any }>()
);
export const onToggleSort = createAction(
  '[Users List Component] On Toggle Sort',
  props<{ sort: UserSortables | null; sortDirection: SortDirection | null }>()
);

export const onDeleteUser = createAction(
  '[Users List Component] On Delete User',
  props<{ userId: number }>()
);

export const onUndeleteUser = createAction(
  '[Users List Component] On Undelete User',
  props<{ userId: number }>()
);

export const onResetPasswordUser = createAction(
  '[Users List Component] On Reset Password User',
  props<{ userId: number }>()
);

export const onCreateUser = createAction(
  '[Users Detail Component] On Create User',
  props<{ payload: CreateUserDto }>()
);

export const onUpdateUser = createAction(
  '[Users Detail Component] On Update User',
  props<{ userId: number; payload: EditUserDto }>()
);

// API
export const onLoadUsersSuccess = createAction(
  '[Users API] On Load Users Success',
  props<{ result: PaginationResult<User> }>()
);
export const onLoadUsersFailure = createAction(
  '[Users API] On Load Users Failure',
  props<{ error: any }>()
);

export const onDeleteUserSuccess = createAction(
  '[Users API] On Delete User Success',
  props<{ result: User }>()
);

export const onDeleteUserFailure = createAction(
  '[Users API] On Delete User Failure',
  props<{ error: any }>()
);

export const onUndeleteUserSuccess = createAction(
  '[Users API] On Undelete User Success',
  props<{ result: User }>()
);

export const onUndeleteUserFailure = createAction(
  '[Users API] On Undelete User Failure',
  props<{ error: any }>()
);

export const onResetPasswordUserSuccess = createAction(
  '[Users API] On Reset Password User Success',
  props<{ result: User }>()
);

export const onResetPasswordUserFailure = createAction(
  '[Users API] On Reset Password User Failure',
  props<{ error: any }>()
);

export const onUpdateUserSuccess = createAction(
  '[Users API] On Update User Success',
  props<{ user: User }>()
);

export const onUpdateUserFailure = createAction(
  '[Users API] On Update User Failure',
  props<{ error: Error }>()
);

export const onCreateUserSuccess = createAction(
  '[Users API] On Create User Success',
  props<{ user: User }>()
);

export const onCreateUserFailure = createAction(
  '[Users API] On Create User Failure',
  props<{ error: Error }>()
);
