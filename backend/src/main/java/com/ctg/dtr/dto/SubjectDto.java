package com.ctg.dtr.dto;

import java.util.Date;

import io.swagger.v3.oas.annotations.media.Schema;
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

    @Schema(type = "string", example = "00:00")
    private String startTime;

    @Schema(type = "string", example = "00:00")
    private String endTime;

    @Schema(type = "string", example = "00:00")
    private String gracePeriod;

    private Integer units;

    private Long sectionId;

    private Object section;

    private Long userId;

    private Object user;
}
