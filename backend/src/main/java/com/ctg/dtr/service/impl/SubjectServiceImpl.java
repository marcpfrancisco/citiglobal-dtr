package com.ctg.dtr.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ctg.dtr.dto.SubjectDto;
import com.ctg.dtr.model.Section;
import com.ctg.dtr.model.Subject;
import com.ctg.dtr.repository.SectionRepository;
import com.ctg.dtr.repository.SubjectRepository;
import com.ctg.dtr.service.SubjectService;

@Service
public class SubjectServiceImpl implements SubjectService {

	@Autowired
    private SubjectRepository subjectRepository;

	@Autowired
    private SectionRepository sectionRepository;

    @Override
    public Optional<Subject> getById(Long id) {
        return subjectRepository.findById(id);
    }

    @Override
	public Subject createSubject(SubjectDto subjectDto) {

		Optional<Section> section = sectionRepository.findById(subjectDto.getSectionId());

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
		subject.setSection(section.isPresent() ? section.get() : null);

		return subjectRepository.save(subject);
	}

    @Override
	public Subject updateSubject(Subject currentSubject, SubjectDto subjectDto) {

		Optional<Section> section = sectionRepository.findById(subjectDto.getSectionId());

        currentSubject.setPublishedAt(subjectDto.getPublishedAt());
        currentSubject.setIsActive(subjectDto.getIsActive());
        currentSubject.setSubjectCode(subjectDto.getSubjectCode());
        currentSubject.setDescription(subjectDto.getDescription());
        currentSubject.setDay(subjectDto.getDay());
        currentSubject.setStartTime(subjectDto.getStartTime());
        currentSubject.setEndTime(subjectDto.getEndTime());
        currentSubject.setGracePeriod(subjectDto.getGracePeriod());
        currentSubject.setUnits(subjectDto.getUnits());
		currentSubject.setSection(section.isPresent() ? section.get() : null);

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
	public List<SubjectDto> getAllSubjects() {

		List<Subject> lSubjects = subjectRepository.findAll();

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
		subjectDto.setSectionId(subject.getSection() != null ? subject.getSection().getId() : 0);
		subjectDto.setSection(subject.getSection());

	}
}
