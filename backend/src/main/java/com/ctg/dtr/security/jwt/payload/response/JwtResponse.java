package com.ctg.dtr.security.jwt.payload.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {

	private Long id;
	private String username;
	private List<String> roles;
	private String token;
}
