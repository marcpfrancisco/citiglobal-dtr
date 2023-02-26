package com.ctg.dtr.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ctg.dtr.dto.RoleDto;
import com.ctg.dtr.model.Role;
import com.ctg.dtr.repository.RoleRepository;
import com.ctg.dtr.service.RoleService;

@Service
public class RoleServiceImpl implements RoleService {

	@Autowired
    private RoleRepository roleRepository;

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

        currentRole.setPublishedAt(roleDto.getPublishedAt());
        currentRole.setIsActive(roleDto.getIsActive());
        currentRole.setName(roleDto.getName());

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
	public List<RoleDto> getAllRoles() {

		List<Role> lRoles = roleRepository.findAll();

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
