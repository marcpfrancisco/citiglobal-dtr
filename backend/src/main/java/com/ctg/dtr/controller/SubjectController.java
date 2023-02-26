package com.ctg.dtr.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

@RestController
@RequestMapping(value = "/api/subject")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

	@PostMapping("/createSubject")
	public ResponseEntity<Subject> createSubject(@RequestBody SubjectDto subjectDto) {

        Subject subject = subjectService.createSubject(subjectDto);

		return new ResponseEntity<Subject>(subject, HttpStatus.CREATED);
	}

	@PutMapping("/updateSubject/{id}")
	public ResponseEntity<?> updateSubject(@PathVariable Long id, @RequestBody SubjectDto subjectDto) {

		Optional<Subject> subject = subjectService.getById(id);

		if (!subject.isPresent()) {

			Map<String, Object> tempMap = new HashMap<String, Object>();

			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Subject ID: " + id);

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			Subject currentSubject = subjectService.updateSubject(subject.get(), subjectDto);
			return new ResponseEntity<Subject>(currentSubject, HttpStatus.OK);
		}
	}

	@DeleteMapping("/deleteSubject/{id}")
	public ResponseEntity<?> deleteSubject(@PathVariable Long id) {

		Optional<Subject> subject = subjectService.getById(id);

		if (!subject.isPresent()) {

			Map<String, Object> tempMap = new HashMap<String, Object>();

			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Subject ID: " + id);

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {

			subjectService.deleteSubject(id);

			Map<String, Object> tempMap = new HashMap<String, Object>();

			tempMap.put("message", "Successfully deleted Subject ID: " + id);

			return ResponseEntity.status(HttpStatus.GONE).body(tempMap);

		}
	}

	@GetMapping("/getSubjectById/{id}")
	public ResponseEntity<?> getSubjectById(@PathVariable Long id) {

		Optional<Subject> subject = subjectService.getById(id);

		if (!subject.isPresent()) {

			Map<String, Object> tempMap = new HashMap<String, Object>();

			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Subject ID: " + id);

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			List<SubjectDto> subjectInfo = subjectService.getSubjectById(id);
			return new ResponseEntity<List<SubjectDto>>(subjectInfo, HttpStatus.OK);
		}
	}

	@GetMapping("/getAllSubjects")
	public ResponseEntity<?> getAllSubjects() {

		List<SubjectDto> subjectInfo = subjectService.getAllSubjects();

		Map<String, Object> tempMap = new TreeMap<String, Object>();

		tempMap.put("count", subjectInfo.size());
		tempMap.put("data", subjectInfo);

		return ResponseEntity.status(HttpStatus.OK).body(tempMap);
	}
}
