import { UserRelations } from '../../enums';

export interface FindUserDto {
  join?: Array<UserRelations>;
  withDeleted?: boolean;
}
