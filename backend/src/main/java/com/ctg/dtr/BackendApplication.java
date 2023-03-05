package com.ctg.dtr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@SpringBootApplication
@SecurityScheme(name = "Bearer Authentication", scheme = "bearer", type = SecuritySchemeType.HTTP, in = SecuritySchemeIn.HEADER, 
				description = "A JWT token is required to access the API. JWT token can be obtained by providing correct "
    		 + "<strong>username</strong> and <strong>password</strong> in the <strong>Authentication Controller</strong>.")
@OpenAPIDefinition(info = @Info(title = "Citi Global API", version = "3.0", description = "Documentation Citi Global API v3.0"))
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
