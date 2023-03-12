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
import org.springframework.stereotype.Service;

import com.ctg.dtr.dto.RoleDto;
import com.ctg.dtr.model.Role;
import com.ctg.dtr.repository.RoleRepository;
import com.ctg.dtr.service.RoleService;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Service
public class RoleServiceImpl implements RoleService {

	@Autowired
    private RoleRepository roleRepository;

	public static Specification<Role> byColumnNameAndValueRole(String columnName, String value) {
        return new Specification<Role>() {
            @Override
            public Predicate toPredicate(Root<Role> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

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
    public Optional<Role> getById(Long id) {
        return roleRepository.findById(id);
    }

    @Override
	public Role createRole(RoleDto roleDto) {

        Role role = new Role();

        role.setPublishedAt(roleDto.getPublishedAt());
        role.setIsActive(roleDto.getIsActive());
        role.setName(roleDto.getName());

		return roleRepository.save(role);
	}

    @Override
	public Role updateRole(Role currentRole, RoleDto roleDto) {

        currentRole.setPublishedAt(roleDto.getPublishedAt() == null ? currentRole.getPublishedAt() : roleDto.getPublishedAt());
        currentRole.setIsActive(roleDto.getIsActive() == null ? currentRole.getIsActive() : roleDto.getIsActive());
        currentRole.setName(roleDto.getName() == null ? currentRole.getName() : roleDto.getName());

        return roleRepository.save(currentRole);
    }

	@Override
	public void deleteRole(Long id) {
		roleRepository.deleteById(id);
	}

    @Override
	public List<RoleDto> getRoleById(Long id) {

		List<Role> lRoles = roleRepository.findRoleById(id);

		List<RoleDto> lRoleDto = new ArrayList<RoleDto>();

		for (Role role : lRoles) {

			RoleDto tmpRole = new RoleDto();

			buildRoleDto(role, tmpRole);

			lRoleDto.add(tmpRole);
		}
		return lRoleDto;
	}

	@Override
	public List<RoleDto> getPaginatedRoleSort(int pageNo, int pageSize, String columnName, String value, String sortDirection) {

		Pageable paging;
		Page<Role> pagedResult = null;

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
				paging =  PageRequest.of(pageNo, pageSize);
			}
		} else {
			paging =  PageRequest.of(pageNo, pageSize);
		}

		if (columnName != null && value != null) {
			pagedResult = roleRepository.findAll(byColumnNameAndValueRole(columnName, value), paging);
		} else {
			pagedResult = roleRepository.findAll(paging);
		}
		
		List<Role> lRoles = pagedResult.getContent();

		List<RoleDto> lRoleDto = new ArrayList<RoleDto>();

		for (Role role : lRoles) {

			RoleDto tmpRole = new RoleDto();

			buildRoleDto(role, tmpRole);

			lRoleDto.add(tmpRole);
		}
		return lRoleDto;
	}

    private void buildRoleDto(Role role, RoleDto roleDto) {

        roleDto.setId(role.getId());
		roleDto.setCreatedAt(role.getCreatedAt());
		roleDto.setUpdatedAt(role.getUpdatedAt());
		roleDto.setPublishedAt(role.getPublishedAt());
        roleDto.setIsActive(role.getIsActive());
        roleDto.setName(role.getName());

	}
}
