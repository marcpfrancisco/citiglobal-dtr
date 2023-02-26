import { User } from '@models';

export interface UserSubject {
    forUser: User;
    userIds?: Array<string | number>;
    subjectIds?: Array<string | number>;
}
