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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ctg.dtr.dto.SectionDto;
import com.ctg.dtr.dto.UserDto;
import com.ctg.dtr.model.Section;
import com.ctg.dtr.service.SectionService;
import com.ctg.dtr.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/sections")
public class SectionController {

    @Autowired
    private SectionService sectionService;

	@Autowired
    private UserService userService;

	@Operation(summary = "Add section")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
	@PostMapping
	public ResponseEntity<Section> createSection(@RequestBody SectionDto sectionDto) {

        Section section = sectionService.createSection(sectionDto);

		return new ResponseEntity<Section>(section, HttpStatus.CREATED);
	}

	@Operation(summary = "Update section")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
	@PutMapping("/{id}")
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

	@Operation(summary = "Delete section")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
	@DeleteMapping("/{id}")
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

	@Operation(summary = "Get section by id")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
	@GetMapping("/{id}")
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

	@Operation(summary = "Get all section")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
	@GetMapping("/all")
	public ResponseEntity<?> getAllSection(@RequestParam(value =  "page") int pageNo, @RequestParam(value =  "limit") int pageSize,
	@RequestParam(value =  "sort", required = false) String columnName,
	@RequestParam(value =  "search", required = false) String keyword,
	@RequestParam(required = false) String sortDirection) {

		List<SectionDto> sectionInfo = sectionService.getPaginatedSectionSort(pageNo, pageSize, columnName, keyword, sortDirection);

		if (sectionInfo != null) {

			Map<String, Object> tempMap = new TreeMap<String, Object>();

			tempMap.put("data", sectionInfo);
			tempMap.put("page", pageNo);
			tempMap.put("limit", pageSize);

			if (keyword != null) {
				tempMap.put("search", keyword);
			}
			if (columnName != null) {
				tempMap.put("sort", columnName);
			}
			if (sortDirection != null) {
				tempMap.put("sortDirection", sortDirection);
			}

			tempMap.put("total", sectionInfo.size());

			return ResponseEntity.status(HttpStatus.OK).body(tempMap);
		} else {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(sectionInfo);
		}
	}

	@Operation(summary = "Get user by section id")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
	@GetMapping("/{sectionId}/students")
	public ResponseEntity<?> getUserBySectionId(@RequestParam(value =  "page") int pageNo,
	@RequestParam(value =  "limit") int pageSize,
	@RequestParam(value =  "sort", required = false) String columnName,
	@RequestParam(required = false) String sortDirection,
	@PathVariable Long sectionId) {

		List<UserDto> userInfo = userService.getUserBySectionId(pageNo, pageSize, columnName, sortDirection, sectionId);

		if (userInfo != null) {

			Map<String, Object> tempMap = new TreeMap<String, Object>();

			tempMap.put("data", userInfo);
			tempMap.put("page", pageNo);
			tempMap.put("limit", pageSize);

			if (columnName != null) {
				tempMap.put("sort", columnName);
			}
			if (sortDirection != null) {
				tempMap.put("sortDirection", sortDirection);
			}

			tempMap.put("total", userInfo.size());
			tempMap.put("sectionId", sectionId);

			return ResponseEntity.status(HttpStatus.OK).body(tempMap);
		} else {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(userInfo);
		}
	}

	@Operation(summary = "Remove user by section id")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
	@DeleteMapping("/remove/{userIds}")
	public ResponseEntity<?> removeUserBySectionId(@PathVariable Long[] userIds, HttpServletRequest request, HttpServletResponse response) {

		Map<String, Object> tempMap = new HashMap<String, Object>();

		userService.removeUserBySectionId(userIds);
		tempMap.put("message", "Successfully Remove User by Section!");

		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(tempMap);
	}
}
