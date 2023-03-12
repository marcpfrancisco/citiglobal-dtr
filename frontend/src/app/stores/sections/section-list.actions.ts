import { SectionSortables, SortDirection } from '@enums';
import { PaginationResult } from '@interfaces';
import { Section } from '@models';
import { createAction, props } from '@ngrx/store';

// Section List Component
export const onInit = createAction('[Section List Component] On Init');

export const onLoadSections = createAction(
    '[Sections List Component] On Load Sections',
    props<{ limit: number; page: number }>()
);
export const onSearch = createAction(
    '[Sections List Component] On Search',
    props<{ search: string }>()
);
export const onShowFilters = createAction(
    '[Sections List Component] On Show Filters'
);
export const onApplyFilters = createAction(
    '[Sections List Component] On Apply Filters',
    props<{ filters: any }>()
);

export const onCheckForFilters = createAction(
    '[Sections List Component] On Check for Filter values'
);

export const onHasFilters = createAction(
    '[Sections List Component] Has Filters',
    props<{ hasFilters: boolean }>()
);

export const onToggleSort = createAction(
    '[Sections List Component] On Toggle Sort',
    props<{
        sort: SectionSortables | null;
        sortDirection: SortDirection | null;
    }>()
);

export const onLoadSectionsSuccess = createAction(
    '[Sections API] On Load Sections Success',
    props<{ result: PaginationResult<Section> }>()
);
export const onLoadSectionsFailure = createAction(
    '[Sections API] On Load Sections Failure',
    props<{ error: any }>()
);

export const onUpdateSectionSuccess = createAction(
    '[Sections API] On Update Section Success',
    props<{ section: Section }>()
);

export const onUpdateSectionFailure = createAction(
    '[Sections API] On Update Section Failure',
    props<{ error: Error }>()
);

export const onCreateSectionsSuccess = createAction(
    '[Sections API] On Create Section Success',
    props<{ section: Section }>()
);

export const onCreateSectionFailure = createAction(
    '[Sections API] On Create Section Failure',
    props<{ error: Error }>()
);
