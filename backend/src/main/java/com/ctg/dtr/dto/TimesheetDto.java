package com.ctg.dtr.dto;

import java.util.Date;

import lombok.Data;

@Data
public class TimesheetDto {

	private Long id;

    private Date createdAt;
    
    private Date updatedAt;

    private Date date;

    private Date timeFrom;

    private Date timeTo;

    private String timeRendered;

    private Long userId;

    private Object user;

}
