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

import com.ctg.dtr.dto.UserDto;
import com.ctg.dtr.model.User;
import com.ctg.dtr.service.UserService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/user")
public class UserController {

    @Autowired
    private UserService userService;

	@PostMapping("/createUser")
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

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@PutMapping("/updateUser/{id}")
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

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@DeleteMapping("/deleteUser/{id}")
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

	@GetMapping("/getUserById/{id}")
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

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN') or hasRole('USER')")
	@GetMapping("/getUserByStudentNo")
	public ResponseEntity<?> getUserByStudentNo(@RequestParam String studentNo) {

		List<UserDto> userInfo = userService.getUserByStudentNo(studentNo);

		if (userInfo == null) {
			return new ResponseEntity<List<UserDto>>(userInfo, HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<List<UserDto>>(userInfo, HttpStatus.OK);
		}
	}

	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@GetMapping("/getAllUser")
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

			return ResponseEntity.status(HttpStatus.OK).body(tempMap);
		} else {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(userInfo);
		}
		
	}
}
