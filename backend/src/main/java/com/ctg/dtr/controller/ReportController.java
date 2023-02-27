package com.ctg.dtr.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ctg.dtr.service.ReportService;

@RestController
@RequestMapping(value = "/api/report")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/generate/xlsx/timesheet/{studentId}")
    public ResponseEntity<Resource> generateBarcodeTransactionsReport(@PathVariable String studentId, @RequestParam String startDate, @RequestParam String endDate) {

        Date sd = new Date();
        Date ed = new Date();
        try {
            sd = new SimpleDateFormat("MM-dd-yyyy").parse(startDate);
            ed = new SimpleDateFormat("MM-dd-yyyy").parse(endDate);
        } catch (Exception e) {
            e.printStackTrace();
        }

      InputStreamResource file = new InputStreamResource(reportService.generateTimesheetReport(studentId, sd, ed));

      return ResponseEntity.status(HttpStatus.OK)
          .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"TimesheetReport.xlsx\"")
          .contentType(MediaType.APPLICATION_OCTET_STREAM)
          .body(file);
    }
}
