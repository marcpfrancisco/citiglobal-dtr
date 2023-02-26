import { adminAbility, studentAbility, superAdminAbility } from '@ability';
import { Injectable } from '@angular/core';
import { subject as createSubject } from '@casl/ability';
import {
    AbilityAction,
    AbilitySubject,
    ACTION_MANAGE,
    AppAbility,
    SUBJECT_ALL,
} from '@constants';
import { UserRoles } from '@enums';
import { UserSubject } from '@interfaces';
import { User } from '@models';
import { isObjectLike, isString } from 'lodash';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SubjectAttributes = { [key in string]?: any };

interface CanOptions {
    actions: AbilityAction[];
    subject: AbilitySubject;
    subjectAttributes?: SubjectAttributes;
}

@Injectable({
    providedIn: 'root',
})
export class PermissionsService {
    constructor(private ability: AppAbility) {}

    updateAbilityFor(user: User): void {
        const subject: UserSubject = {
            forUser: user,
            userIds: [user?.id],
        };
        let rules = [];

        switch (user?.role) {
            case UserRoles.SUPERADMIN:
                rules = superAdminAbility(subject);
                break;

            case UserRoles.ADMINISTRATOR:
                rules = adminAbility(subject);
                break;

            case UserRoles.STUDENT:
                rules = studentAbility(subject);
                break;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.ability.update(rules as any);
    }

    removeAllAbilities(): void {
        // removes all ability
        this.ability.update([]);
    }

    can({ actions, subject, subjectAttributes }: CanOptions): boolean {
        if (this.ability.can(ACTION_MANAGE, SUBJECT_ALL)) {
            return true;
        }

        // Invalid subject!
        if (!isString(subject) || !subject) {
            return false;
        }

        const finalizedSubject = isObjectLike(subjectAttributes)
            ? // create subject here for further ability matching of conditions
              createSubject(subject, {
                  ...subjectAttributes,
              })
            : // use the string version
              subject;

        return actions?.every((action) =>
            this.ability.can(action, finalizedSubject as AbilitySubject)
        );
    }
}
