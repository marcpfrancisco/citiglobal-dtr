export interface SubjectModel {
    id: number;

    name: string;
    subjectCode: string;

    createdAt: string | Date;
    updatedAt: string | Date;

    startTime: string;
    endTime: string;

    isActive: boolean;
}
