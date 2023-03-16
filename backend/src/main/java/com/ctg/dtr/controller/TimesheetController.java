package com.ctg.dtr.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ctg.dtr.dto.TimesheetDto;
import com.ctg.dtr.model.Timesheet;
import com.ctg.dtr.payload.request.RfidRequest;
import com.ctg.dtr.service.TimesheetService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/timesheets")
public class TimesheetController {

    @Autowired
    private TimesheetService timesheetService;

	@Operation(summary = "Add timesheet")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@PostMapping
	public ResponseEntity<Timesheet> createTimesheet(@RequestBody TimesheetDto timesheetDto) {

        Timesheet timesheet = timesheetService.createTimesheet(timesheetDto);

		return new ResponseEntity<Timesheet>(timesheet, HttpStatus.CREATED);
	}

	@Operation(summary = "User's daily time record")
	@PostMapping("/daily-time-record")
	public ResponseEntity<?> dailyTimeRecord(@RequestBody RfidRequest rfidRequest, HttpServletRequest request, HttpServletResponse response) {

        Timesheet timesheet = timesheetService.dailyTimeRecord(rfidRequest.getRfidNo());
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (timesheet == null) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error",  HttpStatus.NOT_FOUND);
			tempMap.put("message", "No Student found.");
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			return new ResponseEntity<Timesheet>(timesheet, HttpStatus.OK);
		}
	}

	@Operation(summary = "Update timesheet")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@PutMapping("/{id}")
	public ResponseEntity<?> updateTimesheet(@PathVariable Long id, @RequestBody TimesheetDto timesheetDto,  HttpServletRequest request, HttpServletResponse response) {

		Optional<Timesheet> timesheet = timesheetService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!timesheet.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Timesheet ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			Timesheet currentTimesheet = timesheetService.updateTimesheet(timesheet.get(), timesheetDto);
			return new ResponseEntity<Timesheet>(currentTimesheet, HttpStatus.OK);
		}
	}

	@Operation(summary = "Delete timesheet")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteTimesheet(@PathVariable Long id, HttpServletRequest request, HttpServletResponse response) {

		Optional<Timesheet> timesheet = timesheetService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!timesheet.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Timesheet ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {

			timesheetService.deleteTimesheet(id);
			tempMap.put("message", "Successfully deleted Timesheet ID: " + id);

			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(tempMap);
		}
	}

	@Operation(summary = "Get timesheet by id")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@GetMapping("/{id}")
	public ResponseEntity<?> getTimesheetById(@PathVariable Long id, HttpServletRequest request, HttpServletResponse response) {

		Optional<Timesheet> timesheet = timesheetService.getById(id);
		Map<String, Object> tempMap = new HashMap<String, Object>();

		if (!timesheet.isPresent()) {

			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);

			tempMap.put("status", HttpServletResponse.SC_NOT_FOUND);
			tempMap.put("error", HttpStatus.NOT_FOUND);
			tempMap.put("message", "Missing Timesheet ID: " + id);
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tempMap);

		} else {
			List<TimesheetDto> timesheetInfo = timesheetService.getTimesheetById(id);
			return new ResponseEntity<List<TimesheetDto>>(timesheetInfo, HttpStatus.OK);
		}
	}

	@Operation(summary = "Get all timesheet")
	@SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
	@GetMapping("/all")
	public ResponseEntity<?> getAllTimesheet(@RequestParam(value =  "page") int pageNo, @RequestParam(value =  "limit") int pageSize,
	@RequestParam(value =  "sort", required = false) String columnName,
	@RequestParam(value =  "search", required = false) String keyword,
	@RequestParam(required = false) String sortDirection) {

		List<TimesheetDto> timesheetInfo = timesheetService.getPaginatedTimesheetSort(pageNo, pageSize, columnName, keyword, sortDirection);

		if (timesheetInfo != null) {

			Map<String, Object> tempMap = new TreeMap<String, Object>();

			tempMap.put("data", timesheetInfo);
			tempMap.put("page", pageNo);
			tempMap.put("limit", pageSize);

			if (keyword != null) {
				tempMap.put("search", keyword);
			}
			if (columnName != null) {
				tempMap.put("sort", columnName);
			}
			if (sortDirection != null) {
				tempMap.put("sortDirection", sortDirection);
			}

			tempMap.put("total", timesheetInfo.size());

			return ResponseEntity.status(HttpStatus.OK).body(tempMap);
		} else {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(timesheetInfo);
		}
	}
}
