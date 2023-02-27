import { adminAbility, studentAbility, superAdminAbility } from '@ability';

import { AbilityRule } from '@constants';
import { UserRoles } from '@enums';
import { UserSubject } from '@interfaces';

export type AbilityByRole = {
    [key in UserRoles]: (subject: UserSubject) => AbilityRule[];
};

export const ABILITY_BY_ROLE: AbilityByRole = {
    [UserRoles.SUPERADMIN]: superAdminAbility,
    [UserRoles.ADMINISTRATOR]: adminAbility,
    [UserRoles.STUDENT]: studentAbility,
};
