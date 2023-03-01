import { UserRoles } from '@enums';

export interface EditUserDto {
    firstName?: string;
    isActive?: boolean;
    lastName?: string;
    middleName?: string;
    mobileNumber?: string;
    role?: UserRoles;
    section?: any;
    studentId?: string;
}
