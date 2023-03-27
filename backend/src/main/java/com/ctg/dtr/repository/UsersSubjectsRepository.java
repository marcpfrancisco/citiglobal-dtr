package com.ctg.dtr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.ctg.dtr.model.UsersSubjects;

@Repository
public interface UsersSubjectsRepository extends JpaRepository<UsersSubjects, Long>, JpaSpecificationExecutor<UsersSubjects.UsersSubjectsId> {

}
