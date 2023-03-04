package com.ctg.dtr.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ctg.dtr.dto.UserDto;
import com.ctg.dtr.model.Role;
import com.ctg.dtr.model.Section;
import com.ctg.dtr.model.User;
import com.ctg.dtr.repository.RoleRepository;
import com.ctg.dtr.repository.SectionRepository;
import com.ctg.dtr.repository.UserRepository;
import com.ctg.dtr.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

	@Autowired
    private SectionRepository sectionRepository;

	@Autowired
    private RoleRepository roleRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

    @Override
    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    @Override
	public User createUser(UserDto userDto) {

		Optional<Section> section = sectionRepository.findById(userDto.getSectionId());
		Optional<Role> role = roleRepository.findById(userDto.getRoleId());


        User user = new User();

        user.setPublishedAt(userDto.getPublishedAt());
        user.setIsActive(userDto.getIsActive());
        user.setFirstName(userDto.getFirstName());
        user.setMiddleName(userDto.getMiddleName());
        user.setLastName(userDto.getLastName());
		user.setMobileNumber(userDto.getMobileNumber());
		user.setStudentId(userDto.getStudentId());
		user.setRfidNo(userDto.getRfidNo());
		user.setUsername(userDto.getUsername());
		user.setPassword(passwordEncoder.encode(userDto.getPassword()));

		user.setSection(section.isPresent() ? section.get() : null);
		user.setRole(role.isPresent() ? role.get() : null);


		// if (null == user.getRoles()) {
        //     user.setRoles(new HashSet<>());
        // }
        // userDto.getRoles().stream().forEach(roleName -> {
        //     Role role = roleRepository.findByName(roleName);
        //     if (null == role) {
        //         role = new Role();
        //         role.setUsers(new HashSet<>());
        //     }
        //     role.setName(roleName);
        //     user.addRole(role);
        // });

		return userRepository.save(user);
	}

    @Override
	public User updateUser(User currentUser, UserDto userDto) {

		Optional<Section> section = sectionRepository.findById(userDto.getSectionId());
		Optional<Role> role = roleRepository.findById(userDto.getRoleId());


        currentUser.setPublishedAt(userDto.getPublishedAt());
        currentUser.setIsActive(userDto.getIsActive());
        currentUser.setFirstName(userDto.getFirstName());
        currentUser.setMiddleName(userDto.getMiddleName());
        currentUser.setLastName(userDto.getLastName());
		currentUser.setMobileNumber(userDto.getMobileNumber());
		currentUser.setStudentId(userDto.getStudentId());
		currentUser.setRfidNo(userDto.getRfidNo());
		currentUser.setUsername(userDto.getUsername());
		currentUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
		currentUser.setSection(section.isPresent() ? section.get() : null);
		currentUser.setRole(role.isPresent() ? role.get() : null);


		// if (null == currentUser.getRoles()) {
        //     currentUser.setRoles(new HashSet<>());
        // }
        // userDto.getRoles().stream().forEach(roleName -> {
        //     Role role = roleRepository.findByName(roleName);
        //     if (null == role) {
        //         role = new Role();
        //         role.setUsers(new HashSet<>());
        //     }
        //     role.setName(roleName);
        //     currentUser.addRole(role);
        // });

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
	public List<UserDto> getUserByStudentId(String studentId) {

		List<User> lUsers = userRepository.findUserByStudentId(studentId);

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

	@Override
	public Boolean checkUsernameExists(String username) {
		return userRepository.existsByUsername(username);
	}

    private void buildUserDto(User user, UserDto userDto) {

        userDto.setId(user.getId());
		userDto.setCreatedAt(user.getCreatedAt());
		userDto.setUpdatedAt(user.getUpdatedAt());
		userDto.setPublishedAt(user.getPublishedAt());
        userDto.setIsActive(user.getIsActive());
        userDto.setFirstName(user.getFirstName());
        userDto.setMiddleName(user.getMiddleName());
        userDto.setLastName(user.getLastName());
		userDto.setMobileNumber(user.getMobileNumber());
		userDto.setStudentId(user.getStudentId());
		userDto.setRfidNo(user.getRfidNo());
		userDto.setUsername(user.getUsername());
		userDto.setPassword(user.getPassword());
		userDto.setSectionId(user.getSection() != null ? user.getSection().getId() : 0);
		userDto.setSection(user.getSection());
		// userDto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
		userDto.setRoleId(user.getRole() != null ? user.getRole().getId() : 0);
		userDto.setRole(user.getRole());
	}
}
