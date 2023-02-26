import { Pipe, PipeTransform } from '@angular/core';

import { UserRoles } from '@enums';
import { capitalize } from 'lodash';

@Pipe({
    name: 'userRoles',
})
export class UserRolesPipe implements PipeTransform {
    transform(role: UserRoles): string {
        if (!Object.values(UserRoles).includes(role)) {
            return 'Unknown';
        }

        return role
            .split('-')
            .map((roleName) => capitalize(roleName))
            .join(' ');
    }
}
