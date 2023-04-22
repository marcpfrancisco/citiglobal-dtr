package com.ctg.dtr.service;

import java.util.List;
import java.util.Optional;

import com.ctg.dtr.dto.UserDto;
import com.ctg.dtr.model.User;

public interface UserService {

    Optional<User> getById(Long id);

    User saveUser(User user);

    User createUser(UserDto userDto);

    User updateUser(User currentUser, UserDto userDto);

	void deleteUser(Long id);

	List<UserDto> getUserById(Long id);

    List<UserDto> getUserByStudentNo(String studentNo);

    List<UserDto> getPaginatedUserSort(int pageNo, int pageSize, String columnName, String value, String asc);

    Boolean checkUsernameExists(String username);

    User updatePassword(String password, Long userId);

    void resetPassword(Long userId);
}
