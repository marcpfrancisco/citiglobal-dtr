package com.ctg.dtr.service;

import java.io.ByteArrayInputStream;
import java.util.Date;

public interface ReportService {

    ByteArrayInputStream generateTimesheetReport(String studentId, Date startDate, Date endDate);
}
