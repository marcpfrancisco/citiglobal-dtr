package com.ctg.dtr.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ctg.dtr.dto.TimesheetDto;
import com.ctg.dtr.model.Subject;
import com.ctg.dtr.model.Timesheet;
import com.ctg.dtr.model.User;
import com.ctg.dtr.repository.SubjectRepository;
import com.ctg.dtr.repository.TimesheetRepository;
import com.ctg.dtr.repository.UserRepository;
import com.ctg.dtr.service.TimesheetService;

@Service
public class TimesheetServiceImpl implements TimesheetService {

	@Autowired
    private TimesheetRepository timesheetRepository;

	@Autowired
    private SubjectRepository subjectRepository;

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
        timesheet.setStatus(timesheetDto.getStatus());
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
        currentTimesheet.setStatus(timesheetDto.getStatus());
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
	public Timesheet dailyTimeRecord(String rfidNo) {

        User checkStudentNo = userRepository.findByRfidNo(rfidNo);

        if (checkStudentNo == null) {
            return null;
        }

        SimpleDateFormat formatter = new SimpleDateFormat("EEEE");
        String checkDay = formatter.format(new Date());
        
        Subject nextSubject = subjectRepository.findByDayAndSectionId(checkDay.toUpperCase(), checkStudentNo.getSection().getId());
        Optional<Timesheet> checkTimeLog = timesheetRepository.findTimesheetByUserId(checkStudentNo.getId());


        if (nextSubject != null) { 
            if (nextSubject.getDay().equals(checkDay.toUpperCase())) {

                if (checkTimeLog.isPresent()) {
    
                    Timesheet currentTimesheet = timesheetRepository.findByUserId(checkTimeLog.get().getUser().getId());
    
                    Date startTime = new Date();
                    Date endTime = new Date(); 
        
                    SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
        
                    try {
                        startTime = sdf.parse(nextSubject.getStartTime());
                        endTime = sdf.parse(nextSubject.getEndTime());
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
    
                    long timeSchedDifference = endTime.getTime() - startTime.getTime();
                    long timeDifference = (new Date()).getTime() - currentTimesheet.getTimeIn().getTime();
    
                    long secondsDifference = timeDifference / 1000 % 60;  
                    long minutesDifference = timeDifference / (60 * 1000) % 60; 
                    long hoursDifference = timeDifference / (60 * 60 * 1000);
    
                    if (timeDifference > timeSchedDifference) {
                        
                        currentTimesheet.setTimeOut(new Date());
                        currentTimesheet.setTimeRendered(String.format("%02d", hoursDifference)
                        + ":" + String.format("%02d", minutesDifference)
                        + ":" + String.format("%02d", secondsDifference));
    
                        return timesheetRepository.save(currentTimesheet);
    
                    } else {
    
                        currentTimesheet.setTimeOut(new Date());
                        currentTimesheet.setTimeRendered(String.format("%02d", hoursDifference)
                        + ":" + String.format("%02d", minutesDifference)
                        + ":" + String.format("%02d", secondsDifference));
                        currentTimesheet.setStatus("INCOMPLETE");
    
                        return timesheetRepository.save(currentTimesheet);
                    }
    
                } else {
                
                    String startMinute = nextSubject.getStartTime();
                    String endMinute = nextSubject.getGracePeriod();
        
                    Date startTime = new Date();
                    Date endTime = new Date(); 
                    Date currentTime = new Date(); 
        
                    SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
        
                    try {
                        startTime = sdf.parse(startMinute);
                        endTime = sdf.parse(endMinute);
                        currentTime = sdf.parse(sdf.format(new Date()));
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
        
                    Calendar startCalendar = Calendar.getInstance();
                    startCalendar.setTime(startTime);
                    startCalendar.add(Calendar.DATE, 1);
                
                    Calendar endCalendar = Calendar.getInstance();
                    endCalendar.setTime(endTime);
                    endCalendar.add(Calendar.DATE, 1);
                
                    Calendar currentCalendar = Calendar.getInstance();
                    currentCalendar.setTime(currentTime);
                    currentCalendar.add(Calendar.DATE, 1);
                    currentCalendar.add(Calendar.MINUTE, -1);
                
                    Date currentDate = currentCalendar.getTime();
        
                    if (currentDate.after(startCalendar.getTime()) && currentDate.before(endCalendar.getTime())) {
        
                        Timesheet timesheet = new Timesheet();
            
                        timesheet.setDate(new Date());
                        timesheet.setTimeIn(new Date());
                        timesheet.setTimeOut(null);
                        timesheet.setTimeRendered("00:00:00");
                        timesheet.setStatus("PRESENT");
                        timesheet.setUser(checkStudentNo != null ? checkStudentNo : null);
                
                        return timesheetRepository.save(timesheet);
        
                    } else {
        
                        Timesheet timesheet = new Timesheet();
            
                        timesheet.setDate(new Date());
                        timesheet.setTimeIn(new Date());
                        timesheet.setTimeOut(null);
                        timesheet.setTimeRendered("00:00:00");
                        timesheet.setStatus("LATE");
                        timesheet.setUser(checkStudentNo != null ? checkStudentNo : null);
                
                        return timesheetRepository.save(timesheet);
                    }
                }
    
            } else {
    
                if (checkTimeLog.isPresent()) {
    
                    Timesheet currentTimesheet = timesheetRepository.findByUserId(checkTimeLog.get().getUser().getId());
    
                    long timeDifference = (new Date()).getTime() - currentTimesheet.getTimeIn().getTime();
                    long secondsDifference = timeDifference / 1000 % 60;  
                    long minutesDifference = timeDifference / (60 * 1000) % 60; 
                    long hoursDifference = timeDifference / (60 * 60 * 1000);
                        
                    currentTimesheet.setTimeOut(new Date());
                    currentTimesheet.setTimeRendered(String.format("%02d", hoursDifference)
                    + ":" + String.format("%02d", minutesDifference)
                    + ":" + String.format("%02d", secondsDifference));
        
                    return timesheetRepository.save(currentTimesheet);
                    
                } else {
    
                    Timesheet timesheet = new Timesheet();
        
                    timesheet.setDate(new Date());
                    timesheet.setTimeIn(new Date());
                    timesheet.setTimeOut(null);
                    timesheet.setTimeRendered("00:00:00");
                    timesheet.setStatus("LABORATORY");
                    timesheet.setUser(checkStudentNo != null ? checkStudentNo : null);
            
                    return timesheetRepository.save(timesheet);
                }
            }       
        } else {
                
            if (checkTimeLog.isPresent()) {
    
                Timesheet currentTimesheet = timesheetRepository.findByUserId(checkTimeLog.get().getUser().getId());

                long timeDifference = (new Date()).getTime() - currentTimesheet.getTimeIn().getTime();
                long secondsDifference = timeDifference / 1000 % 60;  
                long minutesDifference = timeDifference / (60 * 1000) % 60; 
                long hoursDifference = timeDifference / (60 * 60 * 1000);
                    
                currentTimesheet.setTimeOut(new Date());
                currentTimesheet.setTimeRendered(String.format("%02d", hoursDifference)
                + ":" + String.format("%02d", minutesDifference)
                + ":" + String.format("%02d", secondsDifference));
    
                return timesheetRepository.save(currentTimesheet);
                
            } else {

                Timesheet timesheet = new Timesheet();
    
                timesheet.setDate(new Date());
                timesheet.setTimeIn(new Date());
                timesheet.setTimeOut(null);
                timesheet.setTimeRendered("00:00:00");
                timesheet.setStatus("LABORATORY");
                timesheet.setUser(checkStudentNo != null ? checkStudentNo : null);
        
                return timesheetRepository.save(timesheet);
            }
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
        timesheetDto.setStatus(timesheet.getStatus());
        timesheetDto.setUserId(timesheet.getUser() != null ? timesheet.getUser().getId() : 0);
		timesheetDto.setUser(timesheet.getUser());
	}
}
