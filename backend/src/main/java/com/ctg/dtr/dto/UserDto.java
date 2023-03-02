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

    private String mobileNumber;

    private String studentId;

    private String rfidNo;

    private Long sectionId;

    private Object section;

    private Long roleId;

    private Object role;

}
