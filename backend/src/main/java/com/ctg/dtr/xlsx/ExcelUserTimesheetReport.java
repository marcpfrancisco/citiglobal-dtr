package com.ctg.dtr.xlsx;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Component;

import com.ctg.dtr.model.Timesheet;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;

@Component
public class ExcelUserTimesheetReport {

    private static String[] columnHeader = {"Date", "Day", "Time In", "Time Out", "Time Rendered"};

    public ByteArrayInputStream generateUserTimesheetReport(List<Timesheet> timesheets) {

        try (SXSSFWorkbook workbook = new SXSSFWorkbook(200);
            ByteArrayOutputStream out = new ByteArrayOutputStream();) {

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

            Row nameRow = sheet.createRow(0);
            Cell labelNameCell = nameRow.createCell(0);
            labelNameCell.setCellValue("Name:");
            labelNameCell.setCellStyle(tableHeadStyle);

            Row studentNoRow = sheet.createRow(1);
            Cell labelStudentNoCell = studentNoRow.createCell(0);
            labelStudentNoCell.setCellValue("Student ID:");
            labelStudentNoCell.setCellStyle(tableHeadStyle);

            Cell labelSectionCell = nameRow.createCell(3);
            labelSectionCell.setCellValue("Section:");
            labelSectionCell.setCellStyle(tableHeadStyle);

            Cell labelCourseCell = studentNoRow.createCell(3);
            labelCourseCell.setCellValue("Course: ");
            labelCourseCell.setCellStyle(tableHeadStyle);

            int rowCount = 6;

            for (Timesheet timesheet : timesheets) {

                if (timesheet.getUser() != null) {

                    Cell cellName = nameRow.createCell(1);
                    cellName.setCellValue(timesheet.getUser().getLastName() + ", "
                    + timesheet.getUser().getFirstName() + ((timesheet.getUser().getMiddleName() == null ? "" : " " + timesheet.getUser().getMiddleName())));

                    Cell cellStudentNo = studentNoRow.createCell(1);
                    cellStudentNo.setCellValue(timesheet.getUser().getStudentNo());

                    if (timesheet.getUser().getSection() != null) {
                        Cell cellSection = nameRow.createCell(4);
                        cellSection.setCellValue(timesheet.getUser().getSection().getName());

                        Cell cellCourse = studentNoRow.createCell(4);
                        cellCourse.setCellValue(timesheet.getUser().getSection().getCourse().getName());
                    }
                }

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
        }
    }
}
