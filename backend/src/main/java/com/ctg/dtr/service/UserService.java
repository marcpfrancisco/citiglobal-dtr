package com.ctg.dtr.service;

import java.util.List;
import java.util.Optional;

import com.ctg.dtr.dto.UserDto;
import com.ctg.dtr.model.User;

public interface UserService {

    Optional<User> getById(Long id);

    User createUser(UserDto userDto);

    User updateUser(User currentUser, UserDto userDto);

	void deleteUser(Long id);

	List<UserDto> getUserById(Long id);

    List<UserDto> getUserByStudentId(String studentId);

	List<UserDto> getAllUsers();

    Boolean checkUsernameExists(String username);
}
