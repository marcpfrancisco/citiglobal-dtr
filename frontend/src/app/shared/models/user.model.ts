import { UserRoles } from '@enums';
import { Section } from './section.model';
import { Subject } from './subject.model';

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: UserRoles;
    active: boolean;
    sections?: Section[];
    subjects?: Subject[];
    createdAt: string | Date;
    updatedAt: string | Date;
}
