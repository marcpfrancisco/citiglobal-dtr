import { UserRoles } from '@enums';
import { Section } from '../../models/section.model';

export interface EditUserDto {
    firstName?: string;
    isActive?: boolean;
    lastName?: string;
    middleName?: string;
    mobileNumber?: string;
    role?: UserRoles;
    section?: Section;
    studentId?: string;
    username?: string;
    email?: string;
    rfidNo?: string;
}
