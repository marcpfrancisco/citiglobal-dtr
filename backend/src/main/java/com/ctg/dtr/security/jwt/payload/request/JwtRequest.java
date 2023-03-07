package com.ctg.dtr.security.jwt.payload.request;

import lombok.Data;

@Data
public class JwtRequest {
	
	private String username;
	private String password;
}
