import { UserRoles } from '@enums';
import { Section } from './section.model';
import { SubjectModel } from './subject.model';
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

    mobileNo?: string;
    studentNo: string;
    rfidNo: string;
    role: UserRoles;
    section?: Section;
    subjects?: SubjectModel[];
}
