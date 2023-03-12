import { TimeLog, User } from '@models';
import { createAction, props } from '@ngrx/store';

//  Time Log List Component
export const onInit = createAction('[Time Log Component] On Init');

export const onSearchRFID = createAction(
    '[Time Log Component] On Search RFID',
    props<{ rfidNo: User['rfidNo'] }>()
);

export const onTimeLogSuccess = createAction(
    '[Time Log Component] On Time Log Failure',
    props<{ result: TimeLog }>()
);

export const onTimeLogFailure = createAction(
    '[Time Log Component] On Time Log Failure',
    props<{ error: Error }>()
);

export const onClearTimeLogField = createAction(
    '[Time Log Component] On Clear Time Log Field'
);
