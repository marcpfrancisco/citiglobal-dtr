package com.ctg.dtr.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ctg.dtr.dto.SectionDto;
import com.ctg.dtr.model.Section;
import com.ctg.dtr.service.SectionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/section")
public class SectionController {

    @Autowired
    private SectionService sectionService;

	@PostMapping("/createSection")
	public ResponseEntity<Section> createSection(@RequestBody SectionDto sectionDto) {

        Section section = sectionService.createSection(sectionDto);

		return new ResponseEntity<Section>(section, HttpStatus.CREATED);
	}

	@PutMapping("/updateSection/{id}")
	public ResponseEntity<?> updateSection(@PathVariable Long id, @RequestBody SectionDto sectionDto, HttpServletRequest request, HttpServletResponse response) {

		Optional<Section> section = sectionService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!section.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Section ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			Section currentSection = sectionService.updateSection(section.get(), sectionDto);
			return new ResponseEntity<Section>(currentSection, HttpStatus.OK);
		}
	}

	@DeleteMapping("/deleteSection/{id}")
	public ResponseEntity<?> deleteSection(@PathVariable Long id, HttpServletRequest request, HttpServletResponse response) {

		Optional<Section> section = sectionService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!section.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Section ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {

			sectionService.deleteSection(id);
			tempMap.put("message", "Successfully deleted Section ID: " + id);

			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(tempMap);
		}
	}

	@GetMapping("/getSectionById/{id}")
	public ResponseEntity<?> getSectionById(@PathVariable Long id, HttpServletRequest request, HttpServletResponse response) {

		Optional<Section> section = sectionService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!section.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Section ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			List<SectionDto> sectionInfo = sectionService.getSectionById(id);
			return new ResponseEntity<List<SectionDto>>(sectionInfo, HttpStatus.OK);
		}
	}

	@GetMapping("/getAllSections")
	public ResponseEntity<?> getAllSections() {

		List<SectionDto> sectionInfo = sectionService.getAllSections();

		Map<String, Object> tempMap = new TreeMap<String, Object>();

		tempMap.put("count", sectionInfo.size());
		tempMap.put("data", sectionInfo);

		return ResponseEntity.status(HttpStatus.OK).body(tempMap);
	}
}
