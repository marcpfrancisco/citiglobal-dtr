package com.ctg.dtr.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.ctg.dtr.security.jwt.payload.request.JwtRequest;
import com.ctg.dtr.security.jwt.payload.response.JwtResponse;
import com.ctg.dtr.security.jwt.service.impl.UserDetailsImpl;
import com.ctg.dtr.security.jwt.utils.JwtUtil;

import jakarta.validation.Valid;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/authentication")
public class AuthenticationController {

    @Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private AuthenticationManager authenticationManager;

	@PostMapping(value = "/authenticate")
	public ResponseEntity<?> createAuthenticationToken(@Valid @RequestBody JwtRequest authenticationRequest) {

		Authentication authentication = authenticationManager.authenticate(
			new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword()));
	
		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtil.generateJwtToken(authentication);
		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
   
		List<String> role = userDetails.getAuthorities().stream()
			.map(item -> item.getAuthority())
			.collect(Collectors.toList());
	
		return ResponseEntity.ok(new JwtResponse(userDetails.getId(), 
							 userDetails.getUsername(), 
							 String.valueOf(role == null || role.isEmpty() ? "" : role.get(0)),
							 jwt));
	}
}
