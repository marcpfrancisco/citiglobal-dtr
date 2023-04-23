import { UserRoles } from '@enums';
import { Section } from '../../models/section.model';

export interface CreateUserDto {
    firstName: string;
    isActive: boolean;
    lastName: string;
    middleName?: string;
    mobileNumber?: string;
    role: UserRoles;
    sectionId?: number;
    section?: Section;
    rfidNo: string;
    username: string;
    email: string;
    studentId: string;
}
