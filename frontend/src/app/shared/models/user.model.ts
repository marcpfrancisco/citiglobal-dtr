import { UserRoles } from '@enums';

export interface User {
    id: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    publishedAt: string | Date;
    deletedAt: string | Date;
    isActive: boolean;
    firstName: string;
    middleName?: string;
    lastName: string;
    fullName?: string;
    mobileNumber?: string;
    studentId: string;
    rfidNo: string;
    section?: any;
    role: UserRoles;
}
