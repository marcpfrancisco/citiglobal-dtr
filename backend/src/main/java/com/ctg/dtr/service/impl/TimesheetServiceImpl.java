package com.ctg.dtr.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.ctg.dtr.dto.TimesheetDto;
import com.ctg.dtr.model.Subject;
import com.ctg.dtr.model.Timesheet;
import com.ctg.dtr.model.User;
import com.ctg.dtr.repository.SubjectRepository;
import com.ctg.dtr.repository.TimesheetRepository;
import com.ctg.dtr.repository.UserRepository;
import com.ctg.dtr.service.TimesheetService;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Service
public class TimesheetServiceImpl implements TimesheetService {

	@Autowired
    private TimesheetRepository timesheetRepository;

	@Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    public static Specification<Timesheet> byColumnNameAndValueTimesheet(String value) {
        return new Specification<Timesheet>() {
            @Override
            public Predicate toPredicate(Root<Timesheet> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

				Join<User, Timesheet> subqueryUser = root.join("user");

				Predicate predicateForData = criteriaBuilder.or(
					criteriaBuilder.like(root.get("id").as(String.class), "%" +  value + "%"),
					criteriaBuilder.like(root.get("createdAt").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("updatedAt").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("date").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("timeIn").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("timeOut").as(String.class), "%" + value + "%"),
					criteriaBuilder.like(root.get("timeRendered"), "%" + value + "%"),
					criteriaBuilder.like(root.get("status"), "%" + value + "%"),
					criteriaBuilder.like(subqueryUser.get("firstName"), "%" + value + "%"),
					criteriaBuilder.like(subqueryUser.get("middleName"), "%" + value + "%"),
					criteriaBuilder.like(subqueryUser.get("lastName"), "%" + value + "%"));

				return criteriaBuilder.and(predicateForData);
            }
        };
    }

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

        currentTimesheet.setDate(timesheetDto.getDate() == null ? currentTimesheet.getDate() : timesheetDto.getDate());
        currentTimesheet.setTimeIn(timesheetDto.getTimeIn() == null ? currentTimesheet.getTimeIn() : timesheetDto.getTimeIn());
        currentTimesheet.setTimeOut(timesheetDto.getTimeOut() == null ? currentTimesheet.getTimeOut() : timesheetDto.getTimeOut());
        currentTimesheet.setTimeRendered(timesheetDto.getTimeRendered() == null ? currentTimesheet.getTimeRendered() : timesheetDto.getTimeRendered());
        currentTimesheet.setStatus(timesheetDto.getStatus() == null ? currentTimesheet.getStatus() : timesheetDto.getStatus());
		currentTimesheet.setUser(user.isPresent() ? user.get() : currentTimesheet.getUser());

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
	public List<TimesheetDto> getPaginatedTimesheetSort(int pageNo, int pageSize, String columnName, String value, String sortDirection) {

		Pageable paging;
		Page<Timesheet> pagedResult = null;

		if (columnName != null) {
			if (sortDirection != null) {
				if (sortDirection.toLowerCase().equals("asc")) {
					paging =  PageRequest.of(pageNo, pageSize, Sort.by(columnName).ascending());
				} else if (sortDirection.toLowerCase().equals("desc")) {
					paging =  PageRequest.of(pageNo, pageSize, Sort.by(columnName).descending());
				} else {
					paging =  PageRequest.of(pageNo, pageSize, Sort.by(columnName));
				}
			} else {
				paging =  PageRequest.of(pageNo, pageSize, Sort.by(columnName));
			}
		} else {
			paging =  PageRequest.of(pageNo, pageSize);
		}

		if (value != null) {
			pagedResult = timesheetRepository.findAll(byColumnNameAndValueTimesheet(value), paging);
		} else {
			pagedResult = timesheetRepository.findAll(paging);
		}

		List<Timesheet> lTimesheets = pagedResult.getContent();

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

        Timesheet currentTimesheet = timesheetRepository.findTimesheetByUserId(checkStudentNo.getId());

        if (checkStudentNo.getSection() == null) {

            if (currentTimesheet != null) {

                Timesheet timesheet = setTimeOutRecord(rfidNo);

                return timesheetRepository.save(timesheet);

            } else {

                Timesheet timesheet = setTimeInRecord(rfidNo);
                timesheet.setStatus("LABORATORY");

                return timesheetRepository.save(timesheet);
            }
        }

        SimpleDateFormat formatter = new SimpleDateFormat("EEEE");
        String checkDay = formatter.format(new Date());

        Subject nextSubject = subjectRepository.findSubjectByDayAndSectionId(checkDay.toUpperCase(), checkStudentNo.getSection().getId());

        if (nextSubject != null) {

            if (nextSubject.getDay().equals(checkDay.toUpperCase())) {

                if (currentTimesheet != null) {

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

                    if (timeDifference > timeSchedDifference) {

                        Timesheet timesheet = setTimeOutRecord(rfidNo);

                        return timesheetRepository.save(timesheet);

                    } else {

                        Timesheet timesheet = setTimeOutRecord(rfidNo);
                        timesheet.setStatus("INCOMPLETE");

                        return timesheetRepository.save(timesheet);
                    }
                } else {

                    String endMinute = nextSubject.getGracePeriod();

                    Date endTime = new Date();
                    Date currentTime = new Date();

                    SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");

                    try {
                        endTime = sdf.parse(endMinute);
                        currentTime = sdf.parse(sdf.format(new Date()));
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }

                    Calendar endCalendar = Calendar.getInstance();
                    endCalendar.setTime(endTime);
                    endCalendar.add(Calendar.DATE, 1);

                    Calendar currentCalendar = Calendar.getInstance();
                    currentCalendar.setTime(currentTime);
                    currentCalendar.add(Calendar.DATE, 1);
                    currentCalendar.add(Calendar.MINUTE, -1);

                    Date currentDate = currentCalendar.getTime();

                    if (currentDate.before(endCalendar.getTime())) {

                        Timesheet timesheet = setTimeInRecord(rfidNo);
                        timesheet.setStatus("PRESENT");

                        return timesheetRepository.save(timesheet);

                    } else {

                        Timesheet timesheet = setTimeInRecord(rfidNo);
                        timesheet.setStatus("LATE");

                        return timesheetRepository.save(timesheet);
                    }
                }
            } else {

                if (currentTimesheet != null) {

                    Timesheet timesheet = setTimeOutRecord(rfidNo);

                    return timesheetRepository.save(timesheet);

                } else {

                    Timesheet timesheet = setTimeInRecord(rfidNo);
                    timesheet.setStatus("LABORATORY");

                    return timesheetRepository.save(timesheet);
                }
            }
        } else {

            if (currentTimesheet != null) {

                Timesheet timesheet = setTimeOutRecord(rfidNo);

                return timesheetRepository.save(timesheet);

            } else {

                Timesheet timesheet = setTimeInRecord(rfidNo);
                timesheet.setStatus("LABORATORY");

                return timesheetRepository.save(timesheet);
            }
        }
	}

    public Timesheet setTimeInRecord(String rfidNo) {

        Timesheet timesheet = new Timesheet();

        User checkStudentNo = userRepository.findByRfidNo(rfidNo);

        if (checkStudentNo == null) {
            return null;
        } else {

            timesheet.setDate(new Date());
            timesheet.setTimeIn(new Date());
            timesheet.setTimeOut(null);
            timesheet.setTimeRendered("00:00:00");
            timesheet.setUser(checkStudentNo != null ? checkStudentNo : null);

            return timesheet;
        }
    }

    public Timesheet setTimeOutRecord(String rfidNo) {

        User checkStudentNo = userRepository.findByRfidNo(rfidNo);

        if (checkStudentNo == null) {
            return null;
        }

        Timesheet currentTimesheet = timesheetRepository.findTimesheetByUserId(checkStudentNo.getId());

        long timeDifference = (new Date()).getTime() - currentTimesheet.getTimeIn().getTime();
        long secondsDifference = timeDifference / 1000 % 60;
        long minutesDifference = timeDifference / (60 * 1000) % 60;
        long hoursDifference = timeDifference / (60 * 60 * 1000);

        currentTimesheet.setTimeOut(new Date());
        currentTimesheet.setTimeRendered(String.format("%02d", hoursDifference)
        + ":" + String.format("%02d", minutesDifference)
        + ":" + String.format("%02d", secondsDifference));

        return currentTimesheet;
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
		timesheetDto.setUser(timesheet.getUser() != null ? timesheet.getUser() : null);
	}
}
