package com.ctg.dtr.dto;

import java.util.Date;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class TimesheetDto {

	private Long id;

    private Date createdAt;
    
    private Date updatedAt;

    private Date date;

    private Date timeIn;

    private Date timeOut;

    @Schema(type = "string", example = "00:00:00")
    private String timeRendered;

    private String status;

    private Long userId;

    private Object user;

}
