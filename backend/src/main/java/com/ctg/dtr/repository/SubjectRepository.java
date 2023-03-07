package com.ctg.dtr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ctg.dtr.model.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long>, JpaSpecificationExecutor<Subject> {

    @Query(value = "SELECT * FROM subject WHERE day = ?1 AND section_id = ?2 "
    + "AND start_time > CURRENT_TIME() ORDER BY start_time ASC LIMIT 1", nativeQuery = true) 
    Subject findSubjectByDayAndSectionId(String day, Long sectionId);

    List<Subject> findBySectionId(Long sectionId);

    @Query(value = "SELECT * FROM subject WHERE id = ?1", nativeQuery = true) 
    List<Subject> findSubjectById(Long id);

    @Query(value = "SELECT " 
    + "subject.id, subject.created_at, subject.updated_at, "
    + "subject.published_at, subject.is_active, subject.subject_code, "
    + "subject.description, subject.day, subject.start_time, "
    + "subject.end_time, subject.grace_period, subject.units, "
    + "subject.section_id "
    + "FROM subject "
    + "INNER JOIN user ON user.section_id = subject.section_id "
    + "INNER JOIN role ON user.role_id = role.id "
    + "WHERE user.id = ?1 AND role.name = 'STUDENT'", nativeQuery = true) 
    List<Subject> findSubjectByStudent(Long userId);

    @Query(value = "SELECT " 
    + "subject.id, subject.created_at, subject.updated_at, "
    + "subject.published_at, subject.is_active, subject.subject_code, "
    + "subject.description, subject.day, subject.start_time, "
    + "subject.end_time, subject.grace_period, subject.units, "
    + "subject.section_id "
    + "FROM subject "
    + "INNER JOIN user ON user.section_id = subject.section_id "
    + "INNER JOIN role ON user.role_id = role.id "
    + "WHERE user.id = ?1 AND role.name = 'TEACHER'", nativeQuery = true) 
    List<Subject> findSubjectByTeacher(Long userId);
}
