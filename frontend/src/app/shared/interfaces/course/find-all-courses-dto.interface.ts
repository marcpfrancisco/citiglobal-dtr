import { CourseSortables } from '../../enums/courses/courses-sortables.enum';
import { PaginationOption } from '../pagination/pagination-option.interface';

export interface FindAllCoursesDto extends PaginationOption {
    name?: string;
    isActive?: boolean;
    sort?: CourseSortables;
}
