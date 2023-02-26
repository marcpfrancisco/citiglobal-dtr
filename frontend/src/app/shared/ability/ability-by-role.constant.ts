import { AbilityRule } from '@constants';
import { UserRoles } from '@enums';
import { UserSubject } from '@interfaces';
import { superAdminAbility, adminAbility, studentAbility } from '@ability';

export type AbilityByRole = {
    [key in UserRoles]: (subject: UserSubject) => AbilityRule[];
};

export const ABILITY_BY_ROLE: AbilityByRole = {
    [UserRoles.SUPERADMIN]: superAdminAbility,
    [UserRoles.ADMINISTRATOR]: adminAbility,
    [UserRoles.STUDENT]: studentAbility,
};
