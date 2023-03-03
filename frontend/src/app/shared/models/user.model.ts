import { UserRoles } from '@enums';

export interface User {
    id: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    deletedAt: string | Date;
    isActive: boolean;
    firstName: string;
    middleName: string;
    lastName: string;
    mobileNumber: string;
    studentId: string;
    section: any;
    role: UserRoles;
}
