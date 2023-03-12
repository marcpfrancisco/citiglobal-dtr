package com.ctg.dtr.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

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

	public static Specification<User> byColumnNameAndValueUser(String columnName, String value) {
        return new Specification<User>() {
            @Override
            public Predicate toPredicate(Root<User> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

				// if (exact) {
                //     return builder.equal(root.<String>get(columnName), value);
                // } else {
                //     return builder.like(root.<String>get(columnName), "%" + value + "%");
                // }

                // return builder.equal(root.<String>get(columnName), value);

				return builder.like(root.<String>get(columnName), "%" + value + "%");
            }
        };
    }

    @Override
    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    @Override
	public User createUser(UserDto userDto) {

		Optional<Section> section = sectionRepository.findById(userDto.getSectionId());
		Optional<Role> role = roleRepository.findRoleByName(userDto.getRole());

        User user = new User();

        user.setPublishedAt(userDto.getPublishedAt());
        user.setIsActive(userDto.getIsActive());
        user.setFirstName(userDto.getFirstName());
        user.setMiddleName(userDto.getMiddleName());
        user.setLastName(userDto.getLastName());
		user.setMobileNo(userDto.getMobileNo());
		user.setStudentNo(userDto.getStudentNo());
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

		Optional<Section> section = null;

		if (userDto.getSectionId() != null) {
			section = sectionRepository.findById(userDto.getSectionId());
		}

		Optional<Role> role = roleRepository.findRoleByName(userDto.getRole());

        currentUser.setPublishedAt(userDto.getPublishedAt() == null ? currentUser.getPublishedAt() : userDto.getPublishedAt());
        currentUser.setIsActive(userDto.getIsActive() == null ? currentUser.getIsActive() : userDto.getIsActive());
        currentUser.setFirstName(userDto.getFirstName() == null ? currentUser.getFirstName() : userDto.getFirstName());
        currentUser.setMiddleName(userDto.getMiddleName() == null ? currentUser.getMiddleName() : userDto.getMiddleName());
        currentUser.setLastName(userDto.getLastName() == null ? currentUser.getLastName() : userDto.getLastName());
		currentUser.setMobileNo(userDto.getMobileNo() == null ? currentUser.getMobileNo() : userDto.getMobileNo());
		currentUser.setStudentNo(userDto.getStudentNo() == null ? currentUser.getStudentNo() : userDto.getStudentNo());
		currentUser.setRfidNo(userDto.getRfidNo() == null ? currentUser.getRfidNo() : userDto.getRfidNo());
		currentUser.setUsername(userDto.getUsername() == null ? currentUser.getUsername() : userDto.getUsername());
		currentUser.setPassword(userDto.getPassword() == null ? currentUser.getPassword() : passwordEncoder.encode(userDto.getPassword()));

		currentUser.setSection(section != null ? section.get() : currentUser.getSection());
		currentUser.setRole(role.isPresent() ? role.get() : currentUser.getRole());

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
	public List<UserDto> getUserByStudentNo(String studentNo) {

		List<User> lUsers = userRepository.findUserByStudentNo(studentNo);

		List<UserDto> lUserDto = new ArrayList<UserDto>();

		for (User user : lUsers) {

			UserDto tmpUser = new UserDto();

			buildUserDto(user, tmpUser);

			lUserDto.add(tmpUser);
		}
		return lUserDto;
	}

	@Override
	public List<UserDto> getPaginatedUserSort(int pageNo, int pageSize, String columnName, String value, String sortDirection) {

		Pageable paging;
		Page<User> pagedResult = null;

		if (columnName != null) {
			if (sortDirection != null) {
				if (sortDirection.toLowerCase().equals("asc")) {
					paging =  PageRequest.of(pageNo, pageSize, Sort.by(columnName).ascending());
				} else if (sortDirection.toLowerCase().equals("desc")) {
					paging =  PageRequest.of(pageNo, pageSize, Sort.by(columnName).descending());
				} else {
					paging =  PageRequest.of(pageNo, pageSize, Sort.by(columnName));
				}
			} else {
				paging =  PageRequest.of(pageNo, pageSize, Sort.by(columnName));
			}
		} else {
			paging =  PageRequest.of(pageNo, pageSize);
		}

		if (columnName != null && value != null) {
			pagedResult = userRepository.findAll(byColumnNameAndValueUser(columnName, value), paging);
		} else {
			pagedResult = userRepository.findAll(paging);
		}

		List<User> lUsers = pagedResult.getContent();

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
        userDto.setFullName(user.getFirstName() + (user.getMiddleName() == null ? " " + user.getLastName() : " " + user.getMiddleName() + " " + user.getLastName()));
		userDto.setMobileNo(user.getMobileNo());
		userDto.setStudentNo(user.getStudentNo());
		userDto.setRfidNo(user.getRfidNo());
		userDto.setUsername(user.getUsername());
		userDto.setPassword(user.getPassword());

		userDto.setSectionId(user.getSection() != null ? user.getSection().getId() : 0);
		userDto.setSection(user.getSection() != null ? user.getSection(): null);
		// userDto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
		// userDto.setRoleId(user.getRole() != null ? user.getRole().getId() : 0);
		userDto.setRole(user.getRole() != null ? user.getRole().getName() : "");
	}
}
