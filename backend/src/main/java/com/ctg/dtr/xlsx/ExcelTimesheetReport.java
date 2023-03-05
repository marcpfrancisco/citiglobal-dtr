package com.ctg.dtr.xlsx;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ctg.dtr.model.Timesheet;
import com.ctg.dtr.model.User;
import com.ctg.dtr.repository.UserRepository;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;

@Component
public class ExcelTimesheetReport {

    static String[] columnHeader = {"Date", "Day", "Time In", "Time Out", "Time Rendered"};

    @Autowired
    private UserRepository userRepository;

    public ByteArrayInputStream generateTimesheetReport(List<Timesheet> timesheets) {

        SXSSFWorkbook workbook = new SXSSFWorkbook(200);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream();) {

            Sheet sheet = workbook.createSheet("Timesheet Report");

            sheet.setColumnWidth(0, 20 * 256);
            sheet.setColumnWidth(1, 25 * 256);
            sheet.setColumnWidth(2, 25 * 256);
            sheet.setColumnWidth(3, 25 * 256);
            sheet.setColumnWidth(4, 25 * 256);

            // CREATE HEADER
            CellStyle tableHeadStyle = workbook.createCellStyle();
            tableHeadStyle.setAlignment(HorizontalAlignment.LEFT);

            // HEADER FONT
            Font tableHeadFont = workbook.createFont();
            tableHeadFont.setBold(true);
            tableHeadStyle.setFont(tableHeadFont);

            Row header = sheet.createRow(5);

            // HEADERS ROW
            for (int col = 0; col < columnHeader.length; col++) {
                Cell cell = header.createCell(col);
                cell.setCellValue(columnHeader[col]);
                cell.setCellStyle(tableHeadStyle);
            }

            // ROWS ALIGNMENT
            CellStyle horizontalRowLeft = workbook.createCellStyle();
            horizontalRowLeft.setAlignment(HorizontalAlignment.LEFT);
    
            SimpleDateFormat dateFormat = new SimpleDateFormat("MMMM dd, yyyy");
            SimpleDateFormat timestampFormat = new SimpleDateFormat("HH:mm:ss aa");
            SimpleDateFormat dayFormat = new SimpleDateFormat("EEEEE");

            int rowCount = 6;

            for (Timesheet timesheet : timesheets) {

                User checkUser = userRepository.findByStudentId(timesheet.getUser().getStudentId());

                Row companyRow = sheet.createRow(0);
			    Cell labelNameCell = companyRow.createCell(0);
			    labelNameCell.setCellValue("Name:");
			    labelNameCell.setCellStyle(tableHeadStyle);

			    Cell cellCompany = companyRow.createCell(1);
			    cellCompany.setCellValue((checkUser.getLastName() + ", " + 
                checkUser.getFirstName() + (checkUser.getMiddleName() == null ? "" : " " + checkUser.getMiddleName())));

			    Row employeeRow = sheet.createRow(1);
			    Cell labelStudentIdCell = employeeRow.createCell(0);
			    labelStudentIdCell.setCellValue("Student ID: ");
			    labelStudentIdCell.setCellStyle(tableHeadStyle);

			    Cell cellEmployee = employeeRow.createCell(1);
			    cellEmployee.setCellValue(checkUser.getStudentId());

                Row row = sheet.createRow(rowCount++);

                if (timesheet.getDate() != null) {                
                    row.createCell(0).setCellValue(String.valueOf(dateFormat.format(timesheet.getDate())));
                    row.getCell(0).setCellStyle(horizontalRowLeft);

                    row.createCell(1).setCellValue(String.valueOf(dayFormat.format(timesheet.getDate())));
                    row.getCell(1).setCellStyle(horizontalRowLeft);
                }
                if (timesheet.getTimeIn() != null) {
                    row.createCell(2).setCellValue(String.valueOf(timestampFormat.format(timesheet.getTimeIn())));
                    row.getCell(2).setCellStyle(horizontalRowLeft);             
                }
                if (timesheet.getTimeOut() != null) {
                    row.createCell(3).setCellValue(String.valueOf(timestampFormat.format(timesheet.getTimeOut())));
                    row.getCell(3).setCellStyle(horizontalRowLeft);             
                }
                if (timesheet.getTimeRendered() != null) {
                    row.createCell(4).setCellValue(timesheet.getTimeRendered());
                    row.getCell(4).setCellStyle(horizontalRowLeft);             
                }
            }

            workbook.write(out);

            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to import data to Excel file: " + e.getMessage());
        } finally {
            workbook.dispose();
        }
    }
}
