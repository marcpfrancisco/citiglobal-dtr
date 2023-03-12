package com.ctg.dtr.service;

import java.io.ByteArrayInputStream;
import java.util.Date;

public interface ReportService {

    ByteArrayInputStream generateUserTimesheetReport(String studentNo, Date startDate, Date endDate);

    ByteArrayInputStream generateAllTimesheetReport();
}
