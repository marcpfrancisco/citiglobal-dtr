import { AbilityRule, ACTION_MANAGE, SUBJECT_ALL } from '@constants';
import { UserSubject } from '@interfaces';

export function superAdminAbility(subject: UserSubject): AbilityRule[] {
    subject;
    return [
        {
            action: ACTION_MANAGE,
            subject: SUBJECT_ALL,
        },
    ];
}
