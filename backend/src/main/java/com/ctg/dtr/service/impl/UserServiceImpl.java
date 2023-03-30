package com.ctg.dtr.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import com.ctg.dtr.dto.UserDto;
import com.ctg.dtr.model.Role;
import com.ctg.dtr.model.Section;
import com.ctg.dtr.model.Subject;
import com.ctg.dtr.model.User;
import com.ctg.dtr.repository.RoleRepository;
import com.ctg.dtr.repository.SectionRepository;
import com.ctg.dtr.repository.SubjectRepository;
import com.ctg.dtr.repository.UserRepository;
import com.ctg.dtr.service.UserService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
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
	private SubjectRepository subjectRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
    private JavaMailSender javaMailSender;

	public static Specification<User> byColumnNameAndValueUser(String value) {
        return new Specification<User>() {
            @Override
            public Predicate toPredicate(Root<User> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

				Join<Section, User> subquerySection = root.join("section", JoinType.LEFT);
				Join<Role, User> subqueryRole = root.join("role", JoinType.INNER);

				Predicate predicateForData = criteriaBuilder.or(
					criteriaBuilder.like(root.get("id").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("createdAt").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("updatedAt").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("publishedAt").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("isActive").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("firstName"), "%" + value + "%"),
					criteriaBuilder.like(root.get("middleName"), "%" + value + "%"),
					criteriaBuilder.like(root.get("lastName"), "%" + value + "%"),
					criteriaBuilder.like(root.get("mobileNo"), "%" + value + "%"),
					criteriaBuilder.like(root.get("studentNo"), "%" + value + "%"),
					criteriaBuilder.like(root.get("rfidNo"), "%" + value + "%"),
					criteriaBuilder.like(root.get("email"), "%" + value + "%"),
					criteriaBuilder.like(root.get("username"), "%" + value + "%"),
					criteriaBuilder.like(root.get("password"), "%" + value + "%"),
					criteriaBuilder.like(subquerySection.get("name"), "%" + value + "%"),
					criteriaBuilder.like(subqueryRole.get("name"), "%" + value + "%"));

				return criteriaBuilder.and(predicateForData);
            }
        };
    }

    @Override
    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

	@Override
	public User saveUser(User user) {
		return userRepository.save(user);
	}

    @Override
	public User createUser(UserDto userDto) {

		Optional<Section> section = sectionRepository.findById(userDto.getSectionId() != null ? userDto.getSectionId() : 0);
		Optional<Role> role = roleRepository.findRoleByName(userDto.getRole() != null ? userDto.getRole() : null);

        User user = new User();

		String tempPassword = generateRandomPassword(6);

        user.setPublishedAt(userDto.getPublishedAt());
        user.setIsActive(userDto.getIsActive());
        user.setFirstName(userDto.getFirstName());
        user.setMiddleName(userDto.getMiddleName());
        user.setLastName(userDto.getLastName());
		user.setMobileNo(userDto.getMobileNo());
		user.setStudentNo(userDto.getStudentNo());
		user.setRfidNo(userDto.getRfidNo());
		user.setEmail(userDto.getEmail());
		user.setUsername(userDto.getUsername());
		user.setPassword(passwordEncoder.encode(tempPassword));

		user.setSection(section.isPresent() ? section.get() : null);
		user.setRole(role.isPresent() ? role.get() : null);

		try {
			MimeMessage mimeMessage = javaMailSender.createMimeMessage();
			MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
			mimeMessageHelper.setFrom(new InternetAddress("iamhitman15@gmail.com"));
			mimeMessageHelper.setTo(new InternetAddress(userDto.getEmail()));

			String fullName = userDto.getLastName().toUpperCase() + (userDto.getMiddleName() == null ? ", "
			+ userDto.getFirstName().toUpperCase() : ", "
			+ userDto.getFirstName().toUpperCase() + " " + userDto.getMiddleName().toUpperCase());

			mimeMessageHelper.setSubject("Citi Global DTR Credentials (" + fullName + ")");

			String username = userDto.getUsername();
			String subject = "Citi Global DTR Credentials (" + fullName + ")";
			String templateName = "new-user.template.html";

			Map<String, Object> params = new HashMap<>();
			params.put("fullName", fullName);
			params.put("subject", subject);
			params.put("username", username);
			params.put("tempPassword", tempPassword);

			String messageText = getHtmlTemplate(templateName, params);
			mimeMessageHelper.setText(messageText, true);

			javaMailSender.send(mimeMessage);

		} catch (MessagingException e) {
			e.printStackTrace();
		}

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

		Optional<Section> section = sectionRepository.findById(userDto.getSectionId() != null ? userDto.getSectionId() : currentUser.getSection().getId());
		Optional<Role> role = roleRepository.findRoleByName(userDto.getRole() != null ? userDto.getRole() : currentUser.getRole().getName());

        currentUser.setPublishedAt(userDto.getPublishedAt() == null ? currentUser.getPublishedAt() : userDto.getPublishedAt());
        currentUser.setIsActive(userDto.getIsActive() == null ? currentUser.getIsActive() : userDto.getIsActive());
        currentUser.setFirstName(userDto.getFirstName() == null ? currentUser.getFirstName() : userDto.getFirstName());
        currentUser.setMiddleName(userDto.getMiddleName() == null ? currentUser.getMiddleName() : userDto.getMiddleName());
        currentUser.setLastName(userDto.getLastName() == null ? currentUser.getLastName() : userDto.getLastName());
		currentUser.setMobileNo(userDto.getMobileNo() == null ? currentUser.getMobileNo() : userDto.getMobileNo());
		currentUser.setStudentNo(userDto.getStudentNo() == null ? currentUser.getStudentNo() : userDto.getStudentNo());
		currentUser.setRfidNo(userDto.getRfidNo() == null ? currentUser.getRfidNo() : userDto.getRfidNo());
		currentUser.setEmail(userDto.getEmail() == null ? currentUser.getEmail() : userDto.getEmail());
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

		if (value != null) {
			pagedResult = userRepository.findAll(byColumnNameAndValueUser(value), paging);
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

	public static String generateRandomPassword(int passwordLength) {

        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
 
        for (int i = 0; i < passwordLength; i++) {
            int randomIndex = random.nextInt(chars.length());
            sb.append(chars.charAt(randomIndex));
        }
 
        return sb.toString();
    }

	private String getHtmlTemplate(String templateName, Map<String, Object> model) {

		String html = "";
	
		try {
			ClassPathResource resource = new ClassPathResource("com/ctg/dtr/constants/email-templates/" + templateName);
		  	InputStream inputStream = resource.getInputStream();
		  	byte[] bdata = FileCopyUtils.copyToByteArray(inputStream);
			html = new String(bdata, StandardCharsets.UTF_8);
	
		  	if (model != null && !model.isEmpty()) {
				for (Map.Entry<String, Object> entry : model.entrySet()) {
			  		String key = "{{ " + entry.getKey() + " }}";
			  		String value = entry.getValue().toString();
			  		html = html.replace(key, value);
				}
		  	}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return html;
	  }

    private void buildUserDto(User user, UserDto userDto) {

		List<Subject> lSubjects = subjectRepository.findSubjectsByUsersId(user.getId());

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
		userDto.setEmail(user.getEmail());
		userDto.setUsername(user.getUsername());
		userDto.setPassword(user.getPassword());
		userDto.setSectionId(user.getSection() != null ? user.getSection().getId() : 0);
		userDto.setSection(user.getSection() != null ? user.getSection() : null);
		userDto.setSubject(lSubjects.isEmpty() ? null : lSubjects);
		// userDto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
		// userDto.setRoleId(user.getRole() != null ? user.getRole().getId() : 0);
		userDto.setRole(user.getRole() != null ? user.getRole().getName() : "");
	}
}
