import { isString } from 'lodash';
import { User } from '../../models/user.model';

export function createUserFullName(user: User): string {
    const { firstName, lastName } = user;

    if (isString(firstName) && isString(lastName)) {
        return `${firstName} ${lastName}`;
    }

    return '';
}
