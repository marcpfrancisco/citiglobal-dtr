package com.ctg.dtr.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ctg.dtr.dto.RoleDto;
import com.ctg.dtr.model.Role;
import com.ctg.dtr.service.RoleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @Operation(summary = "Add role")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	@PostMapping
	public ResponseEntity<Role> createRole(@RequestBody RoleDto roleDto) {

        Role role = roleService.createRole(roleDto);

		return new ResponseEntity<Role>(role, HttpStatus.CREATED);
	}

    @Operation(summary = "Update role")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	@PutMapping("/{id}")
	public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody RoleDto roleDto, HttpServletRequest request, HttpServletResponse response) {

		Optional<Role> role = roleService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!role.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Role ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			Role currentRole = roleService.updateRole(role.get(), roleDto);
			return new ResponseEntity<Role>(currentRole, HttpStatus.OK);
		}
	}

    @Operation(summary = "Delete role")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteRole(@PathVariable Long id, HttpServletRequest request, HttpServletResponse response) {

		Optional<Role> role = roleService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!role.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Role ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {

			roleService.deleteRole(id);
			tempMap.put("message", "Successfully deleted Role ID: " + id);

			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(tempMap);

		}
	}

    @Operation(summary = "Get role by id")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	@GetMapping("/{id}")
	public ResponseEntity<?> getRoleById(@PathVariable Long id, HttpServletRequest request, HttpServletResponse response) {

		Optional<Role> role = roleService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!role.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Role ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			List<RoleDto> roleInfo = roleService.getRoleById(id);
			return new ResponseEntity<List<RoleDto>>(roleInfo, HttpStatus.OK);
		}
	}

    @Operation(summary = "Get all role")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	@GetMapping("/all")
	public ResponseEntity<?> getAllRole(@RequestParam(value =  "page") int pageNo, @RequestParam(value =  "limit") int pageSize,
	@RequestParam(value =  "sort", required = false) String columnName, 
	@RequestParam(value =  "search", required = false) String keyword, 
	@RequestParam(required = false) String sortDirection) {

		List<RoleDto> roleInfo = roleService.getPaginatedRoleSort(pageNo, pageSize, columnName, keyword, sortDirection);

		if (roleInfo != null) {

			Map<String, Object> tempMap = new TreeMap<String, Object>();

			tempMap.put("data", roleInfo);
			tempMap.put("page", pageNo);
			tempMap.put("limit", pageSize);

			if (keyword != null) {
				tempMap.put("search", keyword);
			}
			if (columnName != null) {
				tempMap.put("sort", columnName);
			}
			if (sortDirection != null) {
				tempMap.put("sortDirection", sortDirection);
			}

			tempMap.put("total", roleInfo.size());

			return ResponseEntity.status(HttpStatus.OK).body(tempMap);
		} else {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(roleInfo);
		}
		
	}
}
