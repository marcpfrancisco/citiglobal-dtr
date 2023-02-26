import { AbilityRule, ACTION_MANAGE, SUBJECT_ALL } from '@constants';
import { UserSubject } from '@interfaces';

export function superAdminAbility(subject: UserSubject): AbilityRule[] {
    return [
        {
            action: ACTION_MANAGE,
            subject: SUBJECT_ALL,
        },
    ];
}
