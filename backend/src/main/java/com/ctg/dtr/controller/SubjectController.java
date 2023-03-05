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
import org.springframework.web.bind.annotation.RestController;

import com.ctg.dtr.dto.SubjectDto;
import com.ctg.dtr.model.Subject;
import com.ctg.dtr.service.SubjectService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/subject")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@PostMapping("/createSubject")
	public ResponseEntity<Subject> createSubject(@RequestBody SubjectDto subjectDto) {

        Subject subject = subjectService.createSubject(subjectDto);

		return new ResponseEntity<Subject>(subject, HttpStatus.CREATED);
	}

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@PutMapping("/updateSubject/{id}")
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

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@DeleteMapping("/deleteSubject/{id}")
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

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@GetMapping("/getSubjectById/{id}")
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

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@GetMapping("/getSubjectByStudent/{userId}")
	public ResponseEntity<?> getSubjectByStudentId(@PathVariable Long userId) {

		List<SubjectDto> subjectInfo = subjectService.getSubjectByStudent(userId);

		if (subjectInfo == null) {
			return new ResponseEntity<List<SubjectDto>>(subjectInfo, HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<List<SubjectDto>>(subjectInfo, HttpStatus.OK);
		}
	}

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@GetMapping("/getSubjectByTeacher/{userId}")
	public ResponseEntity<?> getSubjectByTeacher(@PathVariable Long userId) {

		List<SubjectDto> subjectInfo = subjectService.getSubjectByTeacher(userId);

		if (subjectInfo == null) {
			return new ResponseEntity<List<SubjectDto>>(subjectInfo, HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<List<SubjectDto>>(subjectInfo, HttpStatus.OK);
		}
	}

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@GetMapping("/getSubjectBySectionId/{sectionId}")
	public ResponseEntity<?> getSubjectBySectionId(@PathVariable Long sectionId) {

		List<SubjectDto> subjectInfo = subjectService.getSubjectBySectionId(sectionId);

		if (subjectInfo == null) {
			return new ResponseEntity<List<SubjectDto>>(subjectInfo, HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<List<SubjectDto>>(subjectInfo, HttpStatus.OK);
		}
	}

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@GetMapping("/getAllSubjects")
	public ResponseEntity<?> getAllSubjects() {

		List<SubjectDto> subjectInfo = subjectService.getAllSubjects();

		Map<String, Object> tempMap = new TreeMap<String, Object>();

		tempMap.put("count", subjectInfo.size());
		tempMap.put("data", subjectInfo);

		return ResponseEntity.status(HttpStatus.OK).body(tempMap);
	}
}
