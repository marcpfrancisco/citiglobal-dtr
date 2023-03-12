import { UserSortables, SortDirection, SubjectSortables } from '@enums';
import { CreateUserDto, EditUserDto, PaginationResult } from '@interfaces';
import { SubjectModel, User } from '@models';
import { createAction, props } from '@ngrx/store';

// Subject List Component
export const onInit = createAction('[Subject List Component] On Init');

export const onLoadSubject = createAction(
    '[Subject List Component] On Load Subject',
    props<{ limit: number; page: number }>()
);
export const onSearch = createAction(
    '[Subject List Component] On Search',
    props<{ search: string }>()
);
export const onShowFilters = createAction(
    '[Subject List Component] On Show Filters'
);
export const onApplyFilters = createAction(
    '[Subject List Component] On Apply Filters',
    props<{ filters: any }>()
);

export const onCheckForFilters = createAction(
    '[Subject List Component] On Check for Filter values'
);

export const onHasFilters = createAction(
    '[Subject List Component] Has Filters',
    props<{ hasFilters: boolean }>()
);

export const onToggleSort = createAction(
    '[Subject List Component] On Toggle Sort',
    props<{
        sort: SubjectSortables | null;
        sortDirection: SortDirection | null;
    }>()
);

// API
export const onLoadSubjectsSuccess = createAction(
    '[Subjects API] On Load Subjects Success',
    props<{ result: PaginationResult<SubjectModel> }>()
);
export const onLoadSubjectsFailure = createAction(
    '[Subjects API] On Load Subjects Failure',
    props<{ error: any }>()
);
