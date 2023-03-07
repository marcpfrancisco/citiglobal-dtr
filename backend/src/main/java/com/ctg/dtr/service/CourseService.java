package com.ctg.dtr.service;

import java.util.List;
import java.util.Optional;

import com.ctg.dtr.dto.CourseDto;
import com.ctg.dtr.model.Course;

public interface CourseService {

    Optional<Course> getById(Long id);

    Course createCourse(CourseDto courseDto);

    Course updateCourse(Course currentCourse, CourseDto courseDto);

	void deleteCourse(Long id);

	List<CourseDto> getCourseById(Long id);

	List<CourseDto> getAllCourses();
}
