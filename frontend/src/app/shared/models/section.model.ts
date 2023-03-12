import { Course } from './course.model';

export interface Section {
    id: number;

    createdAt: string | Date;
    updatedAt: string | Date;
    publishedAt: string | Date;

    isActive: boolean;
    name: string;

    courseId?: number;
    course?: Course;
}
