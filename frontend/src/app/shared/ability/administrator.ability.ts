import {
  AbilityRule,
  ACTION_MANAGE,
  SUBJECT_ALL,
} from '../constants/ability.constant';
import { UserSubject } from '../interfaces';

export function administratorAbility(subject: UserSubject): AbilityRule[] {
  subject;
  return [
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_ALL,
    },
  ];
}
