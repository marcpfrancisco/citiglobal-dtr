import { UserRelations } from '@enums';

export interface FindTimeLogDto {
    join?: Array<UserRelations>;
    withDeleted?: boolean;
}
