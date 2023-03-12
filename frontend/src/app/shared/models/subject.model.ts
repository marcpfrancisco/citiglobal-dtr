import { Section } from './section.model';

export interface SubjectModel {
    id: string;

    name: string;
    subjectCode: string;
    description: string;

    createdAt: string | Date;
    updatedAt: string | Date;

    day: string;
    startTime: number;
    endTime: number;
    gracePeriod: number;

    units: number;

    isActive: boolean;

    section?: Section;
}
