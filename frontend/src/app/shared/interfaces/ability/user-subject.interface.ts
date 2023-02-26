import { User } from '../../models';

export interface UserSubject {
  forUser: User;
  userIds?: Array<string | number>;
  floristIds?: Array<string | number>;
  siteIds?: Array<string | number>;
}
