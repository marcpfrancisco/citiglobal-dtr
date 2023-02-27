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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ctg.dtr.dto.UserDto;
import com.ctg.dtr.model.User;
import com.ctg.dtr.service.UserService;

@RestController
@RequestMapping(value = "/api/user")
public class UserController {

    @Autowired
    private UserService userService;

	@PostMapping("/createUser")
	public ResponseEntity<User> createUser(@RequestBody UserDto userDto) {

        User user = userService.createUser(userDto);

		return new ResponseEntity<User>(user, HttpStatus.CREATED);
	}

	@PutMapping("/updateUser/{id}")
	public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {

		Optional<User> user = userService.getById(id);

		if (!user.isPresent()) {

			Map<String, Object> tempMap = new HashMap<String, Object>();

			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing User ID: " + id);

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			User currentUser = userService.updateUser(user.get(), userDto);
			return new ResponseEntity<User>(currentUser, HttpStatus.OK);
		}
	}

	@DeleteMapping("/deleteUser/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable Long id) {

		Optional<User> user = userService.getById(id);

		if (!user.isPresent()) {

			Map<String, Object> tempMap = new HashMap<String, Object>();

			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing User ID: " + id);

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {

			userService.deleteUser(id);

			Map<String, Object> tempMap = new HashMap<String, Object>();

			tempMap.put("message", "Successfully deleted User ID: " + id);

			return ResponseEntity.status(HttpStatus.GONE).body(tempMap);

		}
	}

	@GetMapping("/getUserById/{id}")
	public ResponseEntity<?> getUserById(@PathVariable Long id) {

		Optional<User> user = userService.getById(id);

		if (!user.isPresent()) {

			Map<String, Object> tempMap = new HashMap<String, Object>();

			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing User ID: " + id);

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			List<UserDto> userInfo = userService.getUserById(id);
			return new ResponseEntity<List<UserDto>>(userInfo, HttpStatus.OK);
		}
	}

	@GetMapping("/getUserByStudentId")
	public ResponseEntity<?> getUserById(@RequestParam String studentId) {

		List<UserDto> userInfo = userService.getUserByStudentId(studentId);

		if (userInfo == null) {
			return new ResponseEntity<List<UserDto>>(userInfo, HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<List<UserDto>>(userInfo, HttpStatus.OK);
		}
	}

	@GetMapping("/getAllUsers")
	public ResponseEntity<?> getAllUsers() {

		List<UserDto> userInfo = userService.getAllUsers();

		Map<String, Object> tempMap = new TreeMap<String, Object>();

		tempMap.put("count", userInfo.size());
		tempMap.put("data", userInfo);

		return ResponseEntity.status(HttpStatus.OK).body(tempMap);
	}
}
