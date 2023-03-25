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

import com.ctg.dtr.dto.SubjectDto;
import com.ctg.dtr.model.Subject;
import com.ctg.dtr.model.User;
import com.ctg.dtr.repository.SubjectRepository;
import com.ctg.dtr.repository.UserRepository;
import com.ctg.dtr.service.SubjectService;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Service
public class SubjectServiceImpl implements SubjectService {

	@Autowired
    private SubjectRepository subjectRepository;

	@Autowired
    private UserRepository userRepository;

	public static Specification<Subject> byColumnNameAndValueSubject(String value) {
        return new Specification<Subject>() {
            @Override
            public Predicate toPredicate(Root<Subject> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

				Join<User, Subject> subqueryUser = root.join("user");

				Predicate predicateForData = criteriaBuilder.or(
					criteriaBuilder.like(root.get("id").as(String.class), "%" +  value + "%"),
					criteriaBuilder.like(root.get("createdAt").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("updatedAt").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("publishedAt").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("isActive").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("subjectCode"), "%" + value + "%"),
					criteriaBuilder.like(root.get("description"), "%" + value + "%"),
					criteriaBuilder.like(root.get("day"), "%" + value + "%"),
					criteriaBuilder.like(root.get("startTime"), "%" + value + "%"),
					criteriaBuilder.like(root.get("endTime"), "%" + value + "%"),
					criteriaBuilder.like(root.get("gracePeriod"), "%" + value + "%"),
					criteriaBuilder.like(root.get("units").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("isSubjectProctor").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(subqueryUser.get("firstName"), "%" + value + "%"),
					criteriaBuilder.like(subqueryUser.get("middleName"), "%" + value + "%"),
					criteriaBuilder.like(subqueryUser.get("lastName"), "%" + value + "%"));

				return criteriaBuilder.and(predicateForData);
            }
        };
    }

    @Override
    public Optional<Subject> getById(Long id) {
        return subjectRepository.findById(id);
    }

    @Override
	public Subject createSubject(SubjectDto subjectDto) {

		Optional<User> user = userRepository.findById(subjectDto.getUserId() != null ? subjectDto.getUserId() : 0);

        Subject subject = new Subject();

        subject.setPublishedAt(subjectDto.getPublishedAt());
        subject.setIsActive(subjectDto.getIsActive());
        subject.setSubjectCode(subjectDto.getSubjectCode());
        subject.setDescription(subjectDto.getDescription());
        subject.setDay(subjectDto.getDay());
        subject.setStartTime(subjectDto.getStartTime());
        subject.setEndTime(subjectDto.getEndTime());
        subject.setGracePeriod(subjectDto.getGracePeriod());
        subject.setUnits(subjectDto.getUnits());

		if (user.isPresent()) {
			subject.setIsSubjectProctor(user.get().getRole().getName().equals("ROLE_ADMIN") ? true : false);
		} else {
			subject.setIsSubjectProctor(false);
		}

		subject.setUser(user.isPresent() ? user.get() : null);

		return subjectRepository.save(subject);
	}

    @Override
	public Subject updateSubject(Subject currentSubject, SubjectDto subjectDto) {

		Optional<User> user = userRepository.findById(subjectDto.getUserId() != null ? subjectDto.getUserId() : currentSubject.getUser().getId());

        currentSubject.setPublishedAt(subjectDto.getPublishedAt() == null ? currentSubject.getPublishedAt() : subjectDto.getPublishedAt());
        currentSubject.setIsActive(subjectDto.getIsActive() == null ? currentSubject.getIsActive() : subjectDto.getIsActive());
        currentSubject.setSubjectCode(subjectDto.getSubjectCode() == null ? currentSubject.getSubjectCode() : subjectDto.getSubjectCode());
        currentSubject.setDescription(subjectDto.getDescription() == null ? currentSubject.getDescription() : subjectDto.getDescription());
        currentSubject.setDay(subjectDto.getDay() == null ? currentSubject.getDay() : subjectDto.getDay());
        currentSubject.setStartTime(subjectDto.getStartTime() == null ? currentSubject.getStartTime() : subjectDto.getStartTime());
        currentSubject.setEndTime(subjectDto.getEndTime() == null ? currentSubject.getEndTime() : subjectDto.getEndTime());
        currentSubject.setGracePeriod(subjectDto.getGracePeriod() == null ? currentSubject.getGracePeriod() : subjectDto.getGracePeriod());
        currentSubject.setUnits(subjectDto.getUnits() == null ? currentSubject.getUnits() : subjectDto.getUnits());

		if (user.isPresent()) {
			currentSubject.setIsSubjectProctor(user.get().getRole().getName().equals("ROLE_ADMIN") ? true : false);
		} else {
			currentSubject.setIsSubjectProctor(currentSubject.getIsSubjectProctor());
		}

		currentSubject.setUser(user.isPresent() ? user.get() : currentSubject.getUser());

        return subjectRepository.save(currentSubject);
    }

	@Override
	public void deleteSubject(Long id) {
		subjectRepository.deleteById(id);
	}

    @Override
	public List<SubjectDto> getSubjectById(Long id) {

		List<Subject> lSubjects = subjectRepository.findSubjectById(id);

		List<SubjectDto> lSubjectDto = new ArrayList<SubjectDto>();

		for (Subject subject : lSubjects) {

			SubjectDto tmpSubject = new SubjectDto();

			buildSubjectDto(subject, tmpSubject);

			lSubjectDto.add(tmpSubject);
		}
		return lSubjectDto;
	}

	@Override
	public List<SubjectDto> getPaginatedSubjectSort(int pageNo, int pageSize, String columnName, String value, String sortDirection) {

		Pageable paging;
		Page<Subject> pagedResult = null;

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

		if (value != null) {
			pagedResult = subjectRepository.findAll(byColumnNameAndValueSubject(value), paging);
		} else {
			pagedResult = subjectRepository.findAll(paging);
		}

		List<Subject> lSubjects = pagedResult.getContent();

		List<SubjectDto> lSubjectDto = new ArrayList<SubjectDto>();

		for (Subject subject : lSubjects) {

			SubjectDto tmpSubject = new SubjectDto();

			buildSubjectDto(subject, tmpSubject);

			lSubjectDto.add(tmpSubject);
		}
		return lSubjectDto;
	}

    private void buildSubjectDto(Subject subject, SubjectDto subjectDto) {

        subjectDto.setId(subject.getId());
		subjectDto.setCreatedAt(subject.getCreatedAt());
		subjectDto.setUpdatedAt(subject.getUpdatedAt());
		subjectDto.setPublishedAt(subject.getPublishedAt());
        subjectDto.setIsActive(subject.getIsActive());
        subjectDto.setSubjectCode(subject.getSubjectCode());
        subjectDto.setDescription(subject.getDescription());
        subjectDto.setDay(subject.getDay());
        subjectDto.setStartTime(subject.getStartTime());
        subjectDto.setEndTime(subject.getEndTime());
        subjectDto.setGracePeriod(subject.getGracePeriod());
        subjectDto.setUnits(subject.getUnits());
        subjectDto.setIsSubjectProctor(subject.getIsSubjectProctor());
		subjectDto.setUserId(subject.getUser() != null ? subject.getUser().getId() : 0);
		subjectDto.setUser(subject.getUser() != null ? subject.getUser() : null);
	}
}
