package com.ctg.dtr.service;

import java.util.List;
import java.util.Optional;

import com.ctg.dtr.dto.RoleDto;
import com.ctg.dtr.model.Role;

public interface RoleService {

    Optional<Role> getById(Long id);

    Role createRole(RoleDto roleDto);

    Role updateRole(Role currentRole, RoleDto roleDto);

	void deleteRole(Long id);

	List<RoleDto> getRoleById(Long id);

    List<RoleDto> getPaginatedRoleSort(int pageNo, int pageSize, String columnName, String value, String asc);
}
