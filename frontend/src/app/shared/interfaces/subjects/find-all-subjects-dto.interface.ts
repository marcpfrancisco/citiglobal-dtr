import { SectionSortables } from '@enums';
import { PaginationOption } from '@interfaces';
import { Section } from '../../models/section.model';

export interface FindAllSubjectsDto extends PaginationOption {
    subjectCode?: string;
    description?: string;
    isActive?: boolean;
    section?: Section;
    sort?: SectionSortables;
}
