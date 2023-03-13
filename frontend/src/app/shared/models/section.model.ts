import { Course } from './course.model';

export interface Section {
    id: string;

    createdAt: string | Date;
    updatedAt: string | Date;
    publishedAt: string | Date;

    isActive: boolean;
    name: string;

    courseId?: number;
    course?: Course;
}
