import { AbilityRule } from '@constants';
import { UserRoles } from '@enums';
import { UserSubject } from '@interfaces';
import { administratorAbility } from './administrator.ability';
import { managerAbility } from './manager.ability';

export type AbilityByRole = {
    [key in UserRoles]: (subject: UserSubject) => AbilityRule[];
};

export const ABILITY_BY_ROLE: AbilityByRole = {
    [UserRoles.ADMINISTRATOR]: administratorAbility,
    [UserRoles.MANAGER]: managerAbility,
};
