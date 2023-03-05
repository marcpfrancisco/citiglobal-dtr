package com.ctg.dtr.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info =
    @Info(title = "Citi Global API", version = "3.0", description = "Documentation Citi Global API v3.0")
)
public class OpenAPIConfig {

    @Bean
    public OpenAPI customizeOpenAPI() {

        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement()
                .addList(securitySchemeName))
                .components(new Components()
                .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                .name(securitySchemeName)
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .description("Provide the JWT token. JWT token can be obtained from the <strong>Authentication Controller</strong>.")
                .bearerFormat("JWT")));
    }
}
