import { Pipe, PipeTransform } from '@angular/core';
import { AbilityAction, AbilitySubject } from '@constants';
import { PermissionsService, SubjectAttributes } from '@services';
import { isArray, isString } from 'lodash';

@Pipe({
    name: 'able',
})
export class AblePipe implements PipeTransform {
    constructor(private permissionService: PermissionsService) {}

    transform(
        actions: AbilityAction | AbilityAction[],
        subject: AbilitySubject,
        subjectAttributes: SubjectAttributes | null = null
    ): boolean {
        const validActions = isArray(actions)
            ? actions.filter((action) => action && isString(action))
            : actions && isString(actions)
            ? [actions]
            : null;

        if (
            !validActions ||
            !validActions.length ||
            !subject ||
            !isString(subject)
        ) {
            return false;
        }

        return this.permissionService.can({
            actions: validActions,
            subject,
            subjectAttributes,
        });
    }
}
