package com.ctg.dtr.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ctg.dtr.dto.UserDto;
import com.ctg.dtr.model.User;
import com.ctg.dtr.repository.UserRepository;
import com.ctg.dtr.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    @Override
	public User createUser(UserDto userDto) {

        User user = new User();

        user.setName(userDto.getName());

		return userRepository.save(user);
	}

    @Override
	public User updateUser(User currentUser, UserDto userDto) {

        currentUser.setName(userDto.getName());

        return userRepository.save(currentUser);

    }

	@Override
	public void deleteUser(Long id) {
		userRepository.deleteById(id);
	}

    @Override
	public List<UserDto> getUserById(Long id) {

		List<User> lUsers = userRepository.findUserById(id);

		List<UserDto> lUserDto = new ArrayList<UserDto>();

		for (User user : lUsers) {

			UserDto tmpUser = new UserDto();

			buildUserDto(user, tmpUser);

			lUserDto.add(tmpUser);

		}
		return lUserDto;
	}

    @Override
	public List<UserDto> getAllUsers() {

		List<User> lUsers = userRepository.findAll();

		List<UserDto> lUserDto = new ArrayList<UserDto>();

		for (User user : lUsers) {

			UserDto tmpUser = new UserDto();

			buildUserDto(user, tmpUser);

			lUserDto.add(tmpUser);

		}
		return lUserDto;
	}

    private void buildUserDto(User user, UserDto userDto) {

        userDto.setId(user.getId());
        userDto.setName(user.getName());
	}
    
}
