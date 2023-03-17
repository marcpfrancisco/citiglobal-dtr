import { Course } from '../../models/course.model';

export interface EditSectionDto {
    isActive?: boolean;
    name?: string;
    courseId?: Course['id'];
    course?: Course;
}
