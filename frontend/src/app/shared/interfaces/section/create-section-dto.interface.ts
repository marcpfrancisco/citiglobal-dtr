import { Course } from '../../models/course.model';

export interface CreateSectionDto {
    isActive: boolean;
    name: string;
    courseId?: Course['id'];
    course?: Course;
}
