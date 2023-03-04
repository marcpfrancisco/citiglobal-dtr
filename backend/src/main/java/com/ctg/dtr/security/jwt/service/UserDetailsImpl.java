package com.ctg.dtr.security.jwt.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.ctg.dtr.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailsImpl implements UserDetails {
  private static final long serialVersionUID = 1L;

  private Long id;

  private Date createdAt;

  private Date updatedAt;

  private String username;

  @JsonIgnore
  private String password;

  private Collection<? extends GrantedAuthority> authorities;

  public static UserDetailsImpl build(User user) {

    // Multiple Roles
    // List<GrantedAuthority> authorities = null;

    // for (Role checkRole : user.getRoles()) {

    //   authorities = user.getRoles().stream()
    //   .map(role -> new SimpleGrantedAuthority(checkRole.getName()))
    //   .collect(Collectors.toList());
    // }

    return new UserDetailsImpl(
        user.getId(), 
        user.getCreatedAt(), 
        user.getUpdatedAt(), 
        user.getUsername(), 
        user.getPassword(), 
        user.getRole() != null ? Arrays.asList(new SimpleGrantedAuthority(user.getRole().getName())) : new ArrayList<>());
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}
