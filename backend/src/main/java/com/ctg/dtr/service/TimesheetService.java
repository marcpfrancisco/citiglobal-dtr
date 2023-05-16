package com.ctg.dtr.service;

import java.util.List;
import java.util.Optional;

import com.ctg.dtr.dto.TimesheetDto;
import com.ctg.dtr.model.Timesheet;

public interface TimesheetService {

    Optional<Timesheet> getById(Long id);

    Optional<Timesheet> getByUserId(Long userId);

    Timesheet createTimesheet(TimesheetDto timesheetDto);

    Timesheet updateTimesheet(Timesheet currentTimesheet, TimesheetDto timesheetDto);

	void deleteTimesheet(Long id);

	List<TimesheetDto> getTimesheetById(Long id);

    List<TimesheetDto> getTimesheetByUserIdPaginatedSort(int pageNo, int pageSize, String columnName, String sortDirection, Long userId);

    List<TimesheetDto> getPaginatedTimesheetSort(int pageNo, int pageSize, String columnName, String value, String asc);

	Timesheet dailyTimeRecord(String rfidNo);

}
