package com.ctg.dtr.service;

import java.util.List;
import java.util.Optional;

import com.ctg.dtr.dto.SectionDto;
import com.ctg.dtr.model.Section;

public interface SectionService {

    Optional<Section> getById(Long id);

    Section createSection(SectionDto sectionDto);

    Section updateSection(Section currentSection, SectionDto sectionDto);

	void deleteSection(Long id);

	List<SectionDto> getSectionById(Long id);

    List<SectionDto> getPaginatedSectionSort(int pageNo, int pageSize, String columnName, String value, String asc);
}
