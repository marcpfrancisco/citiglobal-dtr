import { UserSubject } from '@interfaces';

import {
    AbilityRule,
    ACTION_LIST,
    ACTION_READ,
    SUBJECT_USER,
} from '@constants';

export function studentAbility(subject: UserSubject): AbilityRule[] {
    return [
        {
            action: ACTION_LIST,
            subject: SUBJECT_USER,
        },
        {
            action: ACTION_READ,
            subject: SUBJECT_USER,
        },
    ];
}
