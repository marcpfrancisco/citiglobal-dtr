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

import com.ctg.dtr.dto.SectionDto;
import com.ctg.dtr.model.Course;
import com.ctg.dtr.model.Section;
import com.ctg.dtr.repository.CourseRepository;
import com.ctg.dtr.repository.SectionRepository;
import com.ctg.dtr.service.SectionService;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Service
public class SectionServiceImpl implements SectionService {

	@Autowired
    private SectionRepository sectionRepository;

	@Autowired
    private CourseRepository courseRepository;

	public static Specification<Section> byColumnNameAndValueSection(String value) {
        return new Specification<Section>() {
            @Override
            public Predicate toPredicate(Root<Section> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

				Join<Course, Section> subqueryCourse = root.join("course");

				Predicate predicateForData = criteriaBuilder.or(
					criteriaBuilder.like(root.get("id").as(String.class), "%" +  value + "%"),
					criteriaBuilder.like(root.get("createdAt").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("updatedAt").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("publishedAt").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("isActive").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("name"), "%" + value + "%"),
					criteriaBuilder.like(subqueryCourse.get("name"), "%" + value + "%"));

				return criteriaBuilder.and(predicateForData);
            }
        };
    }

    @Override
    public Optional<Section> getById(Long id) {
        return sectionRepository.findById(id);
    }

    @Override
	public Section createSection(SectionDto sectionDto) {

		Optional<Course> course = courseRepository.findById(sectionDto.getCourseId() != null ? sectionDto.getCourseId() : 0);

        Section section = new Section();

        section.setPublishedAt(sectionDto.getPublishedAt());
        section.setIsActive(sectionDto.getIsActive());
        section.setName(sectionDto.getName());
		section.setCourse(course.isPresent() ? course.get() : null);

		return sectionRepository.save(section);
	}

    @Override
	public Section updateSection(Section currentSection, SectionDto sectionDto) {

		Optional<Course> course = courseRepository.findById(sectionDto.getCourseId() != null ? sectionDto.getCourseId() : currentSection.getCourse().getId());

        currentSection.setPublishedAt(sectionDto.getPublishedAt() == null ? currentSection.getPublishedAt() : sectionDto.getPublishedAt());
        currentSection.setIsActive(sectionDto.getIsActive() == null ? currentSection.getIsActive() : sectionDto.getIsActive());
        currentSection.setName(sectionDto.getName() == null ? currentSection.getName() : sectionDto.getName());
		currentSection.setCourse(course.isPresent() ? course.get() : currentSection.getCourse());

        return sectionRepository.save(currentSection);
    }

	@Override
	public void deleteSection(Long id) {
		sectionRepository.deleteById(id);
	}

    @Override
	public List<SectionDto> getSectionById(Long id) {

		List<Section> lSections = sectionRepository.findSectionById(id);

		List<SectionDto> lSectionDto = new ArrayList<SectionDto>();

		for (Section section : lSections) {

			SectionDto tmpSection = new SectionDto();

			buildSectionDto(section, tmpSection);

			lSectionDto.add(tmpSection);
		}
		return lSectionDto;
	}

	@Override
	public List<SectionDto> getPaginatedSectionSort(int pageNo, int pageSize, String columnName, String value, String sortDirection) {

		Pageable paging;
		Page<Section> pagedResult = null;

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
			pagedResult = sectionRepository.findAll(byColumnNameAndValueSection(value), paging);
		} else {
			pagedResult = sectionRepository.findAll(paging);
		}

		List<Section> lSections = pagedResult.getContent();

		List<SectionDto> lSectionDto = new ArrayList<SectionDto>();

		for (Section section : lSections) {

			SectionDto tmpSection = new SectionDto();

			buildSectionDto(section, tmpSection);

			lSectionDto.add(tmpSection);
		}
		return lSectionDto;
	}

    private void buildSectionDto(Section section, SectionDto sectionDto) {

        sectionDto.setId(section.getId());
		sectionDto.setCreatedAt(section.getCreatedAt());
		sectionDto.setUpdatedAt(section.getUpdatedAt());
		sectionDto.setPublishedAt(section.getPublishedAt());
        sectionDto.setIsActive(section.getIsActive());
        sectionDto.setName(section.getName());
		sectionDto.setCourseId(section.getCourse() != null ? section.getCourse().getId() : 0);
		sectionDto.setCourse(section.getCourse() != null ? section.getCourse() : null);
	}
}
