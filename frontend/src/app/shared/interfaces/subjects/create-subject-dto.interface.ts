import { Section } from '../../models/section.model';

export interface CreateSubjectDto {
    isActive: boolean;
    subjectCode: string;
    description: string;
    day: string;
    startTime: string | Date;
    endTime: string | Date;
    gracePeriod: string | Date;
    units: number;
    sectionId?: Section['id'];
    section?: Section;
}
