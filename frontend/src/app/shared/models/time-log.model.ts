import { User } from './user.model';

export interface TimeLog {
    id: number;
    name: string;

    createdAt: string | Date;
    updatedAt: string | Date;

    date: string | Date;
    timeIn: string | Date;
    timeOut: string | Date;
    timeRendered: string | Date;
    
    status: string;
    user: User;
}
