import { SortDirection, TimeLogSortables } from '@enums';
import { PaginationResult } from '@interfaces';
import { TimeLog } from '@models';
import { createAction, props } from '@ngrx/store';

//  Time Log List Component
export const onInit = createAction('[Logs List Component] On Init');

export const onLoadTimeLogs = createAction(
    '[Logs List Component] On Load Logs',
    props<{ limit: number; page: number }>()
);
export const onSearch = createAction(
    '[Logs List Component] On Search',
    props<{ search: string }>()
);

export const onSearchRFID = createAction(
    '[Time Log Component] On Search RFID',
    props<{ rfidNo: string }>()
);

export const onShowFilters = createAction(
    '[Logs List Component] On Show Filters'
);
export const onApplyFilters = createAction(
    '[Logs List Component] On Apply Filters',
    props<{ filters: any }>()
);

export const onCheckForFilters = createAction(
    '[Logs List Component] On Check for Filter values'
);

export const onHasFilters = createAction(
    '[Logs List Component] Has Filters',
    props<{ hasFilters: boolean }>()
);

export const onToggleSort = createAction(
    '[Logs List Component] On Toggle Sort',
    props<{
        sort: TimeLogSortables | null;
        sortDirection: SortDirection | null;
    }>()
);

export const onExportTimeSheet = createAction(
    '[Logs List Component] On Export Timesheet'
);

// API
export const onLoadLogsSuccess = createAction(
    '[Logs API] On Load Logs Success',
    props<{ result: PaginationResult<TimeLog> }>()
);

export const onLoadLogsFailure = createAction(
    '[Logs API] On Load Logs Failure',
    props<{ error: any }>()
);

export const onCreateLogSuccess = createAction(
    '[Logs API] On Create User Success',
    props<{ logs: TimeLog }>()
);

export const onCreateLogFailure = createAction(
    '[Logs API] On Create Log Failure',
    props<{ error: Error }>()
);
