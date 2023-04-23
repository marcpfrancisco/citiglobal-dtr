import { UserRoles } from '../enums/user/user-roles.enum';

export const ALLOW_SECTION_USER_ROLES = [
    UserRoles.SUPERADMIN,
    UserRoles.ADMINISTRATOR,
];

export const HAS_ASSIGNED_SECTION_USER_ROLES = [...ALLOW_SECTION_USER_ROLES];

// Assign Section to User
export const SECTION_ASSIGN_USER_SUCCESS_MESSAGE =
    'You have successfully assigned a User.';

// Unassign Section to User
export const SECTION_UNASSIGN_USER_SUCCESS_MESSAGE =
    'You have successfully unassigned User.';
