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
import com.ctg.dtr.dto.UserDto;
import com.ctg.dtr.model.Subject;
import com.ctg.dtr.model.User;
import com.ctg.dtr.payload.request.PasswordRequest;
import com.ctg.dtr.payload.request.SubjectIdRequest;
import com.ctg.dtr.service.SubjectService;
import com.ctg.dtr.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/users")
public class UserController {

    @Autowired
    private UserService userService;

	@Autowired
	private SubjectService subjectService;

	@Operation(summary = "Add user")
	@PostMapping
	public ResponseEntity<?> createUser(@Valid @RequestBody UserDto userDto, HttpServletRequest request, HttpServletResponse response) {

		Boolean checkUsername = userService.checkUsernameExists(userDto.getUsername());
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (checkUsername) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_CONFLICT);

			tempMap.put("status", HttpServletResponse.SC_CONFLICT);
			tempMap.put("error",  HttpStatus.CONFLICT);
			tempMap.put("message", "Username already exists.");
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.CONFLICT).body(tempMap);
		}

        User user = userService.createUser(userDto);
		return new ResponseEntity<User>(user, HttpStatus.CREATED);
	}

	@Operation(summary = "Update user")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
	@PutMapping("/{id}")
	public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDto userDto, HttpServletRequest request, HttpServletResponse response) {

		Optional<User> user = userService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!user.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error",  HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing User ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			User currentUser = userService.updateUser(user.get(), userDto);
			return new ResponseEntity<User>(currentUser, HttpStatus.OK);
		}
	}

	@Operation(summary = "Delete user")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable Long id, HttpServletRequest request, HttpServletResponse response) {

		Optional<User> user = userService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!user.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error",  HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing User ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {

			userService.deleteUser(id);
			tempMap.put("message", "Successfully deleted User ID: " + id);

			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(tempMap);
		}
	}

	@Operation(summary = "Get user by id")
	@GetMapping("/{id}")
	public ResponseEntity<?> getUserById(@PathVariable Long id, HttpServletRequest request, HttpServletResponse response) {

		Optional<User> user = userService.getById(id);

		if (!user.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			Map<String, Object> tempMap = new HashMap<String, Object>();

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error",  HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing User ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			List<UserDto> userInfo = userService.getUserById(id);
			return new ResponseEntity<List<UserDto>>(userInfo, HttpStatus.OK);
		}
	}

	@Operation(summary = "Get user by student number")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY') or hasRole('STUDENT')")
	@GetMapping("/student-no/{studentNo}")
	public ResponseEntity<?> getUserByStudentNo(@PathVariable String studentNo) {

		List<UserDto> userInfo = userService.getUserByStudentNo(studentNo);

		if (userInfo == null) {
			return new ResponseEntity<List<UserDto>>(userInfo, HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<List<UserDto>>(userInfo, HttpStatus.OK);
		}
	}

	@Operation(summary = "Get all user")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
	@GetMapping("/all")
	public ResponseEntity<?> getAllUser(@RequestParam(value =  "page") int pageNo, @RequestParam(value =  "limit") int pageSize,
	@RequestParam(value =  "sort", required = false) String columnName,
	@RequestParam(value =  "search", required = false) String keyword,
	@RequestParam(required = false) String sortDirection) {

		List<UserDto> userInfo = userService.getPaginatedUserSort(pageNo, pageSize, columnName, keyword, sortDirection);

		if (userInfo != null) {

			Map<String, Object> tempMap = new TreeMap<String, Object>();

			tempMap.put("data", userInfo);
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

			tempMap.put("total", userInfo.size());

			return ResponseEntity.status(HttpStatus.OK).body(tempMap);
		} else {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(userInfo);
		}
	}

	@Operation(summary = "Add subject to user")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
	@PostMapping(value = "/{userId}/subjects")
	public ResponseEntity<?> addSubject(@PathVariable Long userId, @RequestBody SubjectIdRequest subjectIdRequest,
										HttpServletRequest request, HttpServletResponse response) {

		Optional<User> userOptional = userService.getById(userId);
		Map<String, Object> tempMap = new HashMap<String, Object>();
	
		if (!userOptional.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing User ID: " + userId);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);
		}
	
		User user = userOptional.get();
		long subjectId = subjectIdRequest.getSubjectId();
		Optional<Subject> subjectOptional = subjectService.getById(subjectId);
	
		if (subjectId != 0L) {

			if (!subjectOptional.isPresent()) {

				response.setContentType(MediaType.APPLICATION_JSON_VALUE);
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
	
				tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
				tempMap.put("error", HttpStatus.NOT_FOUND);
				tempMap.put("message", "Missing Subject ID: " + subjectId);
				tempMap.put("path", request.getServletPath());
	
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);
			}
	
			Subject subject = subjectOptional.get();
			user.addSubject(subject);
			userService.saveUser(user);
			return new ResponseEntity<>(subject, HttpStatus.CREATED);

		} else {
			user.addSubject(subjectOptional.get());
			Subject subject = subjectService.saveSubject(subjectOptional.get());
			return new ResponseEntity<>(subject, HttpStatus.CREATED);
		}
	}

	@Operation(summary = "Delete subject from user")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
	@DeleteMapping(value = "/{userId}/subjects/{subjectId}")
	public ResponseEntity<?> deleteSubjectFromUser(@PathVariable Long userId, @PathVariable Long subjectId,
															HttpServletRequest request, HttpServletResponse response) {

		Map<String, Object> tempMap = new TreeMap<String, Object>();

    	Optional<User> userOptional = userService.getById(userId);
		Optional<Subject> subjectOptional = subjectService.getById(subjectId);

    	if (!userOptional.isPresent()) {
			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing User ID: " + userId);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);
    	}
		if (!subjectOptional.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Subject ID: " + subjectId);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);
		}

    	User user = userOptional.get();
    	user.removeSubject(subjectId);
    	userService.saveUser(user);

    	return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@Operation(summary = "Get all subject from user")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
	@GetMapping("/{userId}/subjects")
	public ResponseEntity<?> getAllSubjectsByUserId(@PathVariable Long userId, HttpServletRequest request, HttpServletResponse response) {

		Map<String, Object> tempMap = new TreeMap<String, Object>();
		Optional<User> userOptional = userService.getById(userId);

    	if (!userOptional.isPresent()) {
			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing User ID: " + userId);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);
    	} else {
			List<SubjectDto> subjectInfo = subjectService.getAllSubjectsByUserId(userId);
			return new ResponseEntity<List<SubjectDto>>(subjectInfo, HttpStatus.OK);
		}
	}

	@Operation(summary = "Update user password")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
	@PutMapping("/update-password/{userId}")
	public ResponseEntity<?> updateUserPassword(@PathVariable Long userId, @RequestBody PasswordRequest passwordRequest, HttpServletRequest request, HttpServletResponse response) {

		Optional<User> user = userService.getById(userId);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!user.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error",  HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing User ID: " + userId);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			User currentUser = userService.updatePassword(passwordRequest.getNewPassword(), userId);
			return new ResponseEntity<User>(currentUser, HttpStatus.OK);
		}
	}

	@Operation(summary = "Reset user password")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
	@PutMapping("/reset-password/{userId}")
	public ResponseEntity<?> resetUserPassword(@PathVariable Long userId, HttpServletRequest request, HttpServletResponse response) {

		Optional<User> user = userService.getById(userId);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!user.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error",  HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing User ID: " + userId);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_OK);

			tempMap.put("status", HttpServletResponse.SC_OK);
			tempMap.put("message", "Successfully!");
			tempMap.put("path", request.getServletPath());

			userService.resetPassword(userId);

			return ResponseEntity.status(HttpStatus.OK).body(tempMap);
		}
	}

	@Operation(summary = "Admin reset user password")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
	@PutMapping("/admin-reset-password/{userId}")
	public ResponseEntity<?> adminResetUserPassword(@PathVariable Long userId, HttpServletRequest request, HttpServletResponse response) {

		Optional<User> user = userService.getById(userId);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!user.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error",  HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing User ID: " + userId);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_OK);

			tempMap.put("status", HttpServletResponse.SC_OK);
			tempMap.put("message", "Successfully!");
			tempMap.put("path", request.getServletPath());

			userService.adminResetUserPassword(userId);

			return ResponseEntity.status(HttpStatus.OK).body(tempMap);
		}
	}
}
