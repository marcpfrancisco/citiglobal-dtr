package com.ctg.dtr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ctg.dtr.model.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course> {

    @Query(value = "SELECT * FROM course WHERE id = ?1", nativeQuery = true)
    List<Course> findCourseById(Long id);
}
