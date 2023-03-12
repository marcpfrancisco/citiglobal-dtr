package com.ctg.dtr.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.ctg.dtr.dto.CourseDto;
import com.ctg.dtr.model.Course;
import com.ctg.dtr.repository.CourseRepository;
import com.ctg.dtr.service.CourseService;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Service
public class CourseServiceImpl implements CourseService {

	@Autowired
    private CourseRepository courseRepository;

	public static Specification<Course> byColumnNameAndValueCourse(String columnName, String value) {
        return new Specification<Course>() {
            @Override
            public Predicate toPredicate(Root<Course> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

				// if (exact) {
                //     return builder.equal(root.<String>get(columnName), value);
                // } else {
                //     return builder.like(root.<String>get(columnName), "%" + value + "%");
                // }

                // return builder.equal(root.<String>get(columnName), value);

				return builder.like(root.<String>get(columnName), "%" + value + "%");
            }
        };
    }

    @Override
    public Optional<Course> getById(Long id) {
        return courseRepository.findById(id);
    }

    @Override
	public Course createCourse(CourseDto courseDto) {

        Course course = new Course();

        course.setPublishedAt(courseDto.getPublishedAt());
        course.setIsActive(courseDto.getIsActive());
        course.setName(courseDto.getName());

		return courseRepository.save(course);
	}

    @Override
	public Course updateCourse(Course currentCourse, CourseDto courseDto) {

        currentCourse.setPublishedAt(courseDto.getPublishedAt() == null ? currentCourse.getPublishedAt() : courseDto.getPublishedAt());
        currentCourse.setIsActive(courseDto.getIsActive() == null ? currentCourse.getIsActive() : courseDto.getIsActive());
        currentCourse.setName(courseDto.getName() == null ? currentCourse.getName() : courseDto.getName());

        return courseRepository.save(currentCourse);
    }

	@Override
	public void deleteCourse(Long id) {
		courseRepository.deleteById(id);
	}

    @Override
	public List<CourseDto> getCourseById(Long id) {

		List<Course> lCourses = courseRepository.findCourseById(id);

		List<CourseDto> lCourseDto = new ArrayList<CourseDto>();

		for (Course course : lCourses) {

			CourseDto tmpCourse = new CourseDto();

			buildCourseDto(course, tmpCourse);

			lCourseDto.add(tmpCourse);
		}
		return lCourseDto;
	}
	
	@Override
	public List<CourseDto> getPaginatedCourseSort(int pageNo, int pageSize, String columnName, String value, String sortDirection) {

		Pageable paging;
		Page<Course> pagedResult = null;

		if (columnName != null) {
			if (sortDirection != null) {
				if (sortDirection.toLowerCase().equals("asc")) {
					paging =  PageRequest.of(pageNo, pageSize, Sort.by(columnName).ascending());
				} else if (sortDirection.toLowerCase().equals("desc")) {
					paging =  PageRequest.of(pageNo, pageSize, Sort.by(columnName).descending());
				} else {
					paging =  PageRequest.of(pageNo, pageSize, Sort.by(columnName));
				}
			} else {
				paging =  PageRequest.of(pageNo, pageSize, Sort.by(columnName));
			}
		} else {
			paging =  PageRequest.of(pageNo, pageSize);
		}

		if (columnName != null && value != null) {
			pagedResult = courseRepository.findAll(byColumnNameAndValueCourse(columnName, value), paging);
		} else {
			pagedResult = courseRepository.findAll(paging);
		}
		
		List<Course> lCourses = pagedResult.getContent();

		List<CourseDto> lCourseDto = new ArrayList<CourseDto>();

		for (Course course : lCourses) {

			CourseDto tmpCourse = new CourseDto();

			buildCourseDto(course, tmpCourse);

			lCourseDto.add(tmpCourse);
		}
		return lCourseDto;
	}

    private void buildCourseDto(Course course, CourseDto courseDto) {

        courseDto.setId(course.getId());
		courseDto.setCreatedAt(course.getCreatedAt());
		courseDto.setUpdatedAt(course.getUpdatedAt());
		courseDto.setPublishedAt(course.getPublishedAt());
        courseDto.setIsActive(course.getIsActive());
        courseDto.setName(course.getName());
	}
}
