package com.ctg.dtr.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ctg.dtr.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    User findByUsername(String username);

    Boolean existsByUsername(String username);

    User findByStudentNo(String studentNo);

    User findByRfidNo(String rfidNo);

    @Query(value = "SELECT * FROM user WHERE student_no = ?1", nativeQuery = true)
    List<User> findUserByStudentNo(String studentNo);

    @Query(value = "SELECT * FROM user WHERE id = ?1", nativeQuery = true)
    List<User> findUserById(Long id);

    Page<User> findBySectionId(Long sectionId, Pageable pageable);

    @Modifying
    @Query(value = "UPDATE user SET section_id = NULL WHERE id IN (:ids)", nativeQuery = true)
    void removeSectionByUserId(@Param("ids") List<Long> ids);

    // List<User> findUsersBySubjectsId(Long tagId);
}
