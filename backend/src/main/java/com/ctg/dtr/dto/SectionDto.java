package com.ctg.dtr.dto;

import java.util.Date;

import lombok.Data;

@Data
public class SectionDto {

	private Long id;

    private Date createdAt;
    
    private Date updatedAt;

    private Date publishedAt;

    private Boolean isActive;

    private String name;
}
