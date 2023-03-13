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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ctg.dtr.service.ReportService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Operation(summary = "Get user timesheet report by student number")
    @SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/{studentNo}")
    public ResponseEntity<Resource> genereateUserTimesheetReport(@PathVariable String studentNo, 
         @Parameter(description = "Date format: <i>MM-DD-YYYY</i>") @RequestParam String startDate, 
         @Parameter(description = "Date format: <i>MM-DD-YYYY</i>") @RequestParam String endDate) {

        Date sd = new Date();
        Date ed = new Date();
        try {
            sd = new SimpleDateFormat("MM-dd-yyyy").parse(startDate);
            ed = new SimpleDateFormat("MM-dd-yyyy").parse(endDate);
        } catch (Exception e) {
            e.printStackTrace();
        }

      InputStreamResource file = new InputStreamResource(reportService.generateUserTimesheetReport(studentNo, sd, ed));

      return ResponseEntity.status(HttpStatus.OK)
          .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"TimesheetReport.xlsx\"")
          .contentType(MediaType.APPLICATION_OCTET_STREAM)
          .body(file);
    }

    @Operation(summary = "Get all user timesheet report")
    @SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<Resource> genereateAllTimesheetReport() {

      InputStreamResource file = new InputStreamResource(reportService.generateAllTimesheetReport());

      return ResponseEntity.status(HttpStatus.OK)
          .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"AllTimesheetReport.xlsx\"")
          .contentType(MediaType.APPLICATION_OCTET_STREAM)
          .body(file);
    }
}
