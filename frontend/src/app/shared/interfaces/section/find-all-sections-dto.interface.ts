import { SectionSortables } from '@enums';
import { PaginationOption } from '@interfaces';

import { Course } from '../../models/course.model';

export interface FindAllSectionsDto extends PaginationOption {
    name?: string;
    course?: Course;
    sectionId?: number;
    isActive?: boolean;
    sort?: SectionSortables;
}
