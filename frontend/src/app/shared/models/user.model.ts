import { UserRoles } from '@enums';
import { Section } from './section.model';

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: UserRoles;
    active: boolean;
    sections?: Section[];
    createdAt: string | Date;
    updatedAt: string | Date;
}
