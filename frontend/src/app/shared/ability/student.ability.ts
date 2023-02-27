import { AbilityRule, ACTION_LIST, ACTION_READ, SUBJECT_LOGS } from '@constants';
import { UserSubject } from '@interfaces';

export function studentAbility(subject: UserSubject): AbilityRule[] {
    return [
        {
            action: ACTION_LIST,
            subject: SUBJECT_LOGS,
        },
        {
            action: ACTION_READ,
            subject: SUBJECT_LOGS,
        },
    ];
}
