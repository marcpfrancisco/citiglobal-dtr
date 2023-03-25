package com.ctg.dtr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ctg.dtr.model.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long>, JpaSpecificationExecutor<Subject> {
    @Query(value = "SELECT * FROM subject WHERE day = ?1 AND user_id = ?2 "
    + "AND end_time > CURRENT_TIME() ORDER BY grace_period ASC LIMIT 1", nativeQuery = true)
    Subject findSubjectByDayAndUserId(String day, Long userId);

    @Query(value = "SELECT * FROM subject WHERE id = ?1", nativeQuery = true)
    List<Subject> findSubjectById(Long id);

    List<Subject> findByUserId(Long userId);
}
