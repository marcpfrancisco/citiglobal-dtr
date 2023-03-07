package com.ctg.dtr.dto;

import java.util.Date;

import lombok.Data;

@Data
public class SubjectDto {

	private Long id;

    private Date createdAt;
     
    private Date updatedAt;

    private Date publishedAt;

    private Boolean isActive;

    private String subjectCode;

    private String description;

    private String day;

    private String startTime;

    private String endTime;

    private String gracePeriod;

    private Integer units;

    private Long sectionId;

    private Object section;
}
