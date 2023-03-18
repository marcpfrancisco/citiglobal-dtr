package com.ctg.dtr.security.jwt.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ctg.dtr.security.jwt.entry.point.JwtAuthEntryPoint;
import com.ctg.dtr.security.jwt.filter.JwtAuthTokenFilter;
import com.ctg.dtr.security.jwt.service.impl.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

  @Autowired
  private UserDetailsServiceImpl userDetailsServiceImpl;

  @Autowired
  private JwtAuthEntryPoint jwtAuthEntryPoint;

  @Bean
  public JwtAuthTokenFilter authenticationJwtTokenFilter() {
    return new JwtAuthTokenFilter();
  }

  @Bean
  public DaoAuthenticationProvider authenticationProvider() {

      DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

      authProvider.setUserDetailsService(userDetailsServiceImpl);
      authProvider.setPasswordEncoder(passwordEncoder());

      return authProvider;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
    return authConfig.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.cors().and().csrf().disable()
        .exceptionHandling().authenticationEntryPoint(jwtAuthEntryPoint).and()
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
        .authorizeHttpRequests()
        .requestMatchers("/api/auth/**",
        "/v3/api-docs/**",
        "configuration/**",
        "/swagger*/**",
        "/webjars/**",
        "/swagger-ui/**",
        "/actuator/**",
        "/auth/**").permitAll()
        .and()
        .authorizeHttpRequests()
        .requestMatchers(HttpMethod.POST, "/api/authentication",
        "/api/users",
        "/api/timesheets/daily-time-record**")
        .permitAll()
        .and()
        .authorizeHttpRequests()
        .requestMatchers(HttpMethod.GET, "/api/users/**")
        .permitAll()
        .anyRequest().authenticated();

    http.authenticationProvider(authenticationProvider());

    http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
