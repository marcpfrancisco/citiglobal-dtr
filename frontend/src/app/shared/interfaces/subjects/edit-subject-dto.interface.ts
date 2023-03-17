import { Section } from '../../models/section.model';

export interface EditSubjectDto {
    isActive?: boolean;
    subjectCode?: string;
    description?: string;
    day?: Array<string>;
    startTime?: string | Date;
    endTime?: string | Date;
    gracePeriod?: string | Date;
    units?: number;
    sectionId?: Section['id'];
    section?: Section;
}
