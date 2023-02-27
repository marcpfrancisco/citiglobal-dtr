package com.ctg.dtr.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ctg.dtr.model.Timesheet;

@Repository
public interface TimesheetRepository extends JpaRepository<Timesheet, Long>, JpaSpecificationExecutor<Timesheet> {

    Timesheet findByUserId(Long userId);

    @Query(value = "SELECT * FROM timesheet WHERE id = ?1", nativeQuery = true) 
    List<Timesheet> findTimesheetById(Long id);

    @Query(value = "SELECT * FROM timesheet WHERE user_id = ?1 AND DATE(date) = CURDATE()", nativeQuery = true) 
    Optional<Timesheet> findTimesheetByUserId(Long userId);

    @Query(value = "SELECT * FROM timesheet WHERE user_id = ?1 AND DATE(date) BETWEEN ?2 AND ?3", nativeQuery = true) 
    List<Timesheet> getDatetimeRecord(Long userId, Date dateFrom, Date dateTo);
}
