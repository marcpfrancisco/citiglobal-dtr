package com.ctg.dtr.service;

import java.util.List;
import java.util.Optional;

import com.ctg.dtr.dto.SubjectDto;
import com.ctg.dtr.model.Subject;

public interface SubjectService {

    Optional<Subject> getById(Long id);

	Subject saveSubject(Subject subject);

    Subject createSubject(SubjectDto subjectDto);

    Subject updateSubject(Subject currentSubject, SubjectDto subjectDto);

	void deleteSubject(Long id);

	List<SubjectDto> getSubjectById(Long id);

    List<SubjectDto> getPaginatedSubjectSort(int pageNo, int pageSize, String columnName, String value, String asc, String userId);

	List<SubjectDto> getAllSubjectsByUserId(Long userId);
}
