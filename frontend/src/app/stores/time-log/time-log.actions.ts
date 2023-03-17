import { TimeLog, User } from '@models';
import { createAction, props } from '@ngrx/store';

//  Time Log List Component
export const onInit = createAction('[Time Log Component] On Init');

export const onSearchRFID = createAction(
    '[Time Log Component] On Search RFID',
    props<{ rfidNo: string }>()
);

export const onUpdateTimeLogField = createAction(
    '[Time Log Component] On Update Time Log Field',
    props<{ newValue: string; prevValue: string }>()
);

export const onClearTimeLogField = createAction(
    '[Time Log Component] On Clear Time Log Field'
);

export const onTimeLogSuccess = createAction(
    '[Time Log Component] On Time Log Success',
    props<{ timeLog: TimeLog }>()
);

export const onTimeLogFailure = createAction(
    '[Time Log Component] On Time Log Failure',
    props<{ error: Error }>()
);
