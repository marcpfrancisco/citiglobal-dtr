package com.ctg.dtr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ctg.dtr.model.Section;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long>, JpaSpecificationExecutor<Section> {

    @Query(value = "SELECT * FROM section WHERE id = ?1", nativeQuery = true) 
    List<Section> findSectionById(Long id);
}
