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

import com.ctg.dtr.dto.SubjectDto;
import com.ctg.dtr.model.Subject;
import com.ctg.dtr.service.SubjectService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/subjects")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

	@Operation(summary = "Add subject")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@PostMapping
	public ResponseEntity<Subject> createSubject(@RequestBody SubjectDto subjectDto) {

        Subject subject = subjectService.createSubject(subjectDto);

		return new ResponseEntity<Subject>(subject, HttpStatus.CREATED);
	}

	@Operation(summary = "Update subject")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@PutMapping("/{id}")
	public ResponseEntity<?> updateSubject(@PathVariable Long id, @RequestBody SubjectDto subjectDto, HttpServletRequest request, HttpServletResponse response) {

		Optional<Subject> subject = subjectService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!subject.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Subject ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			Subject currentSubject = subjectService.updateSubject(subject.get(), subjectDto);
			return new ResponseEntity<Subject>(currentSubject, HttpStatus.OK);
		}
	}

	@Operation(summary = "Delete subject")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteSubject(@PathVariable Long id, HttpServletRequest request, HttpServletResponse response) {

		Optional<Subject> subject = subjectService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!subject.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Subject ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {

			subjectService.deleteSubject(id);
			tempMap.put("message", "Successfully deleted Subject ID: " + id);

			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(tempMap);

		}
	}

	@Operation(summary = "Get subject by id")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@GetMapping("/{id}")
	public ResponseEntity<?> getSubjectById(@PathVariable Long id, HttpServletRequest request, HttpServletResponse response) {

		Optional<Subject> subject = subjectService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!subject.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Subject ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			List<SubjectDto> subjectInfo = subjectService.getSubjectById(id);
			return new ResponseEntity<List<SubjectDto>>(subjectInfo, HttpStatus.OK);
		}
	}

	@Operation(summary = "Get all subject")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@GetMapping("/all")
	public ResponseEntity<?> getAllSubject(@RequestParam(value =  "page") int pageNo, @RequestParam(value =  "limit") int pageSize,
	@RequestParam(value =  "sort", required = false) String columnName, 
	@RequestParam(value =  "search", required = false) String keyword, 
	@RequestParam(required = false) String sortDirection) {

		List<SubjectDto> subjectInfo = subjectService.getPaginatedSubjectSort(pageNo, pageSize, columnName, keyword, sortDirection);

		if (subjectInfo != null) {

			Map<String, Object> tempMap = new TreeMap<String, Object>();

			tempMap.put("data", subjectInfo);
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

			tempMap.put("total", subjectInfo.size());

			return ResponseEntity.status(HttpStatus.OK).body(tempMap);
		} else {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(subjectInfo);
		}
		
	}
}
