package com.ctg.dtr.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ctg.dtr.dto.RoleDto;
import com.ctg.dtr.model.Role;
import com.ctg.dtr.service.RoleService;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/role")
public class RoleController {

    @Autowired
    private RoleService roleService;

	@PostMapping("/createRole")
	public ResponseEntity<Role> createRole(@RequestBody RoleDto roleDto) {

        Role role = roleService.createRole(roleDto);

		return new ResponseEntity<Role>(role, HttpStatus.CREATED);
	}

	@PutMapping("/updateRole/{id}")
	public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody RoleDto roleDto) {

		Optional<Role> role = roleService.getById(id);

		if (!role.isPresent()) {

			Map<String, Object> tempMap = new HashMap<String, Object>();

			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Role ID: " + id);

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			Role currentRole = roleService.updateRole(role.get(), roleDto);
			return new ResponseEntity<Role>(currentRole, HttpStatus.OK);
		}
	}

	@DeleteMapping("/deleteRole/{id}")
	public ResponseEntity<?> deleteRole(@PathVariable Long id) {

		Optional<Role> role = roleService.getById(id);

		if (!role.isPresent()) {

			Map<String, Object> tempMap = new HashMap<String, Object>();

			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Role ID: " + id);

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {

			roleService.deleteRole(id);

			Map<String, Object> tempMap = new HashMap<String, Object>();

			tempMap.put("message", "Successfully deleted Role ID: " + id);

			return ResponseEntity.status(HttpStatus.GONE).body(tempMap);

		}
	}

	@GetMapping("/getRoleById/{id}")
	public ResponseEntity<?> getRoleById(@PathVariable Long id) {

		Optional<Role> role = roleService.getById(id);

		if (!role.isPresent()) {

			Map<String, Object> tempMap = new HashMap<String, Object>();

			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Role ID: " + id);

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			List<RoleDto> roleInfo = roleService.getRoleById(id);
			return new ResponseEntity<List<RoleDto>>(roleInfo, HttpStatus.OK);
		}
	}

	@GetMapping("/getAllRoles")
	public ResponseEntity<?> getAllRoles() {

		List<RoleDto> roleInfo = roleService.getAllRoles();

		Map<String, Object> tempMap = new TreeMap<String, Object>();

		tempMap.put("count", roleInfo.size());
		tempMap.put("data", roleInfo);

		return ResponseEntity.status(HttpStatus.OK).body(tempMap);
	}
}
