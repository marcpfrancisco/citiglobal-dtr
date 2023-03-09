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

import com.ctg.dtr.dto.CourseDto;
import com.ctg.dtr.model.Course;
import com.ctg.dtr.service.CourseService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/course")
public class CourseController {

    @Autowired
    private CourseService courseService;

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@PostMapping("/createCourse")
	public ResponseEntity<Course> createCourse(@RequestBody CourseDto courseDto) {

        Course course = courseService.createCourse(courseDto);

		return new ResponseEntity<Course>(course, HttpStatus.CREATED);
	}

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@PutMapping("/updateCourse/{id}")
	public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody CourseDto courseDto, HttpServletRequest request, HttpServletResponse response) {

		Optional<Course> course = courseService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!course.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Course ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			Course currentCourse = courseService.updateCourse(course.get(), courseDto);
			return new ResponseEntity<Course>(currentCourse, HttpStatus.OK);
		}
	}

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@DeleteMapping("/deleteCourse/{id}")
	public ResponseEntity<?> deleteCourse(@PathVariable Long id, HttpServletRequest request, HttpServletResponse response) {

		Optional<Course> course = courseService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!course.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Course ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {

			courseService.deleteCourse(id);
			tempMap.put("message", "Successfully deleted Course ID: " + id);

			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(tempMap);
		}
	}

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@GetMapping("/getCourseById/{id}")
	public ResponseEntity<?> getCourseById(@PathVariable Long id, HttpServletRequest request, HttpServletResponse response) {

		Optional<Course> course = courseService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!course.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Course ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			List<CourseDto> courseInfo = courseService.getCourseById(id);
			return new ResponseEntity<List<CourseDto>>(courseInfo, HttpStatus.OK);
		}
	}

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@GetMapping("/getAllCourses")
	public ResponseEntity<?> getAllCourses() {

		List<CourseDto> courseInfo = courseService.getAllCourses();

		Map<String, Object> tempMap = new TreeMap<String, Object>();

		tempMap.put("count", courseInfo.size());
		tempMap.put("data", courseInfo);

		return ResponseEntity.status(HttpStatus.OK).body(tempMap);
	}

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@GetMapping("/getPaginatedCourseSort")
	public ResponseEntity<?> getPaginatedCourseSort(@RequestParam int pageNo, @RequestParam int pageSize,
	@RequestParam String column, @RequestParam boolean asc) {

		List<CourseDto> courseInfo = courseService.findPaginatedCourseSort(pageNo, pageSize, column, asc);

		if (courseInfo != null) {
			return new ResponseEntity<List<CourseDto>>(courseInfo, HttpStatus.OK);
		} else {
			return new ResponseEntity<List<CourseDto>>(courseInfo, HttpStatus.NO_CONTENT);
		}
		
	}
}
