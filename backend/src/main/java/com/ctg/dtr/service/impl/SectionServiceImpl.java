package com.ctg.dtr.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ctg.dtr.dto.SectionDto;
import com.ctg.dtr.model.Section;
import com.ctg.dtr.repository.SectionRepository;
import com.ctg.dtr.service.SectionService;

@Service
public class SectionServiceImpl implements SectionService {

	@Autowired
    private SectionRepository sectionRepository;

    @Override
    public Optional<Section> getById(Long id) {
        return sectionRepository.findById(id);
    }

    @Override
	public Section createSection(SectionDto sectionDto) {

        Section section = new Section();

        section.setPublishedAt(sectionDto.getPublishedAt());
        section.setIsActive(sectionDto.getIsActive());
        section.setName(sectionDto.getName());

		return sectionRepository.save(section);
	}

    @Override
	public Section updateSection(Section currentSection, SectionDto sectionDto) {

        currentSection.setPublishedAt(sectionDto.getPublishedAt());
        currentSection.setIsActive(sectionDto.getIsActive());
        currentSection.setName(sectionDto.getName());

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
	public List<SectionDto> getAllSections() {

		List<Section> lSections = sectionRepository.findAll();

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

	}
}
