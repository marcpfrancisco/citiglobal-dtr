import { Section } from './section.model';

export interface SubjectModel {
    id: number;

    name: string;
    subjectCode: string;
    description: string;

    createdAt: string | Date;
    updatedAt: string | Date;

    day: string;
    startTime: string;
    endTime: string;
    gracePeriod: string;

    units: number;

    isActive: boolean;

    section?: Section;
}
