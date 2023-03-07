package com.ctg.dtr.service.impl;

import java.io.ByteArrayInputStream;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ctg.dtr.model.Timesheet;
import com.ctg.dtr.model.User;
import com.ctg.dtr.repository.TimesheetRepository;
import com.ctg.dtr.repository.UserRepository;
import com.ctg.dtr.service.ReportService;
import com.ctg.dtr.xlsx.ExcelTimesheetReport;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private TimesheetRepository timesheetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExcelTimesheetReport excelTimesheetReport;

    @Override
    public ByteArrayInputStream generateTimesheetReport(String studentNo, Date startDate, Date endDate) {

        User checkUser = userRepository.findByStudentNo(studentNo);

        if (checkUser == null) {
            return null;
        } else {
            List<Timesheet> timesheets = timesheetRepository.getDatetimeRecord(checkUser.getId(), startDate, endDate);
            return excelTimesheetReport.generateTimesheetReport(timesheets);
        }
    }
}
