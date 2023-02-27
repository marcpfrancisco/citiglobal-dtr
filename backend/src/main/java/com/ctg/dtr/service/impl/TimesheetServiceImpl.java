package com.ctg.dtr.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ctg.dtr.dto.TimesheetDto;
import com.ctg.dtr.model.Timesheet;
import com.ctg.dtr.model.User;
import com.ctg.dtr.repository.TimesheetRepository;
import com.ctg.dtr.repository.UserRepository;
import com.ctg.dtr.service.TimesheetService;

@Service
public class TimesheetServiceImpl implements TimesheetService {

	@Autowired
    private TimesheetRepository timesheetRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Optional<Timesheet> getById(Long id) {
        return timesheetRepository.findById(id);
    }

    @Override
	public Timesheet createTimesheet(TimesheetDto timesheetDto) {

		Optional<User> user = userRepository.findById(timesheetDto.getUserId());

        Timesheet timesheet = new Timesheet();

        timesheet.setDate(timesheetDto.getDate());
        timesheet.setTimeIn(timesheetDto.getTimeIn());
        timesheet.setTimeOut(timesheetDto.getTimeOut());
        timesheet.setTimeRendered(timesheetDto.getTimeRendered());
		timesheet.setUser(user.isPresent() ? user.get() : null);

		return timesheetRepository.save(timesheet);
	}

    @Override
	public Timesheet updateTimesheet(Timesheet currentTimesheet, TimesheetDto timesheetDto) {

		Optional<User> user = userRepository.findById(timesheetDto.getUserId());

        currentTimesheet.setDate(timesheetDto.getDate());
        currentTimesheet.setTimeIn(timesheetDto.getTimeIn());
        currentTimesheet.setTimeOut(timesheetDto.getTimeOut());
        currentTimesheet.setTimeRendered(timesheetDto.getTimeRendered());
		currentTimesheet.setUser(user.isPresent() ? user.get() : null);

        return timesheetRepository.save(currentTimesheet);
    }

	@Override
	public void deleteTimesheet(Long id) {
		timesheetRepository.deleteById(id);
	}

    @Override
	public List<TimesheetDto> getTimesheetById(Long id) {

		List<Timesheet> lTimesheets = timesheetRepository.findTimesheetById(id);

		List<TimesheetDto> lTimesheetDto = new ArrayList<TimesheetDto>();

		for (Timesheet timesheet : lTimesheets) {

			TimesheetDto tmpTimesheet = new TimesheetDto();

			buildTimesheetDto(timesheet, tmpTimesheet);

			lTimesheetDto.add(tmpTimesheet);

		}
		return lTimesheetDto;
	}

    @Override
	public List<TimesheetDto> getAllTimesheets() {

		List<Timesheet> lTimesheets = timesheetRepository.findAll();

		List<TimesheetDto> lTimesheetDto = new ArrayList<TimesheetDto>();

		for (Timesheet timesheet : lTimesheets) {

			TimesheetDto tmpTimesheet = new TimesheetDto();

			buildTimesheetDto(timesheet, tmpTimesheet);

			lTimesheetDto.add(tmpTimesheet);

		}
		return lTimesheetDto;
	}

    @Override
	public Timesheet dailyTimeRecord(String studentId) {

        User checkStudentId = userRepository.findByStudentId(studentId);

        if (checkStudentId == null) {
            return null;
        }

		Optional<Timesheet> checkTimeLog = timesheetRepository.findTimesheetByUserId(checkStudentId.getId());

        if (checkTimeLog.isPresent()) {

            Timesheet currenTimesheet = timesheetRepository.findByUserId(checkTimeLog.get().getUser().getId());

            long timeDifference = (new Date()).getTime() - currenTimesheet.getTimeIn().getTime();
            long secondsDifference = timeDifference / 1000 % 60;  
            long minutesDifference = timeDifference / (60 * 1000) % 60; 
            long hoursDifference = timeDifference / (60 * 60 * 1000);
                
            currenTimesheet.setTimeOut(new Date());
            currenTimesheet.setTimeRendered(String.format("%02d", hoursDifference)
            + ":" + String.format("%02d", minutesDifference)
            + ":" + String.format("%02d", secondsDifference));

            return timesheetRepository.save(currenTimesheet);

        } else {

            Optional<User> user = userRepository.findById(checkStudentId.getId());

            Timesheet timesheet = new Timesheet();
    
            timesheet.setDate(new Date());
            timesheet.setTimeIn(new Date());
            timesheet.setTimeOut(null);
            timesheet.setTimeRendered("00:00:00");
            timesheet.setUser(user.isPresent() ? user.get() : null);
    
            return timesheetRepository.save(timesheet);
        }
	}

    private void buildTimesheetDto(Timesheet timesheet, TimesheetDto timesheetDto) {

        timesheetDto.setId(timesheet.getId());
		timesheetDto.setCreatedAt(timesheet.getCreatedAt());
		timesheetDto.setUpdatedAt(timesheet.getUpdatedAt());
        timesheetDto.setDate(timesheet.getDate());
        timesheetDto.setTimeIn(timesheet.getTimeIn());
        timesheetDto.setTimeOut(timesheet.getTimeOut());
        timesheetDto.setTimeRendered(timesheet.getTimeRendered());
        timesheetDto.setUserId(timesheet.getUser() != null ? timesheet.getUser().getId() : 0);
		timesheetDto.setUser(timesheet.getUser());
	}
}
