import { SubjectSortables } from '@enums';
import { PaginationOption } from '@interfaces';

import { Section } from '../../models/section.model';

export interface FindAllSubjectsDto extends PaginationOption {
    id?: Array<number>;
    userId?: string | number;
    assignedUserId?: string | number;
    isActive?: boolean;
    section?: Section;
    sort?: SubjectSortables;
}
