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
import com.ctg.dtr.xlsx.ExcelAllTimesheetReport;
import com.ctg.dtr.xlsx.ExcelUserTimesheetReport;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private TimesheetRepository timesheetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExcelUserTimesheetReport excelTimesheetReport;

    @Autowired
    private ExcelAllTimesheetReport excelAllTimesheetReport;

    @Override
    public ByteArrayInputStream generateUserTimesheetReport(String studentNo, Date startDate, Date endDate) {

        User checkUser = userRepository.findByStudentNo(studentNo);

        if (checkUser == null) {
            return null;
        } else {
            List<Timesheet> timesheets = timesheetRepository.getUserDatetimeRecord(checkUser.getId(), startDate, endDate);
            return excelTimesheetReport.generateUserTimesheetReport(timesheets);
        }
    }

    @Override
    public ByteArrayInputStream generateAllTimesheetReport() {

        List<Timesheet> timesheets = timesheetRepository.findAll();
        return excelAllTimesheetReport.generateAllTimesheetReport(timesheets);
    }
}
