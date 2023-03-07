import { User } from '../../models/user.model';

export interface EditTimeLogDto {
    date?: string | Date;
    timeIn?: string | Date;
    timeOut?: string | Date;
    timeRendered?: string | Date;
    status?: string;
    user?: User;
}
