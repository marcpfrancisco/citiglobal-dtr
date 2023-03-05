import { Pipe, PipeTransform } from '@angular/core';
import { isString, startCase, toLower } from 'lodash';
import { User } from '../models/user.model';

@Pipe({
    name: 'userFullName',
})
export class UserFullNamePipe implements PipeTransform {
    transform(user: User) {
        const { firstName, lastName } = user;

        if (!isString(firstName) || !isString(lastName)) {
            return;
        }

        return startCase(toLower(`${firstName} ${lastName}`));
    }
}
