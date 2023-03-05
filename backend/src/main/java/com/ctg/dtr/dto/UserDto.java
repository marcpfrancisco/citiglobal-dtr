package com.ctg.dtr.dto;

import java.util.Date;

import lombok.Data;

@Data
public class UserDto {

    private Long id;
    
    private Date createdAt;
    
    private Date updatedAt;

    private String publishedAt;

    private Boolean isActive;

    private String firstName;

    private String middleName;

    private String lastName;

    private String fullName;

    private String mobileNumber;

    private String studentId;

    private String rfidNo;

    private String username;

    private String password;

    private Long sectionId;

    private Object section;

    private Long roleId;

    private String role;

    // private Set<String> roles = new HashSet<>();
}
