import { UserRoles } from '../enums/user/user-roles.enum';

export const ALLOW_SECTION_USER_ROLES = [
    UserRoles.SUPERADMIN,
    UserRoles.ADMINISTRATOR,
];

export const HAS_ASSIGNED_SECTION_USER_ROLES = [...ALLOW_SECTION_USER_ROLES];
