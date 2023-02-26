import { UserRoles } from '@enums';

export interface EditUserDto {
    name?: string;

    role?: UserRoles;

    email?: string;

    active?: boolean;

    deletedAt?: null;
}
