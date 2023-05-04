package com.ctg.dtr.xlsx;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.util.IOUtils;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFClientAnchor;
import org.springframework.stereotype.Component;

import com.ctg.dtr.model.Timesheet;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.List;

@Component
public class ExcelAllTimesheetReport {

    private static String[] columnHeader = {"Date", "Day", "Time In", "Time Out", "Time Rendered", "Name", "Student ID", "Section", "Course"};

    public ByteArrayInputStream generateAllTimesheetReport(List<Timesheet> timesheets) {

        try (SXSSFWorkbook workbook = new SXSSFWorkbook(200);
            ByteArrayOutputStream out = new ByteArrayOutputStream();) {

            Sheet sheet = workbook.createSheet("Timesheet Report");

            sheet.setColumnWidth(0, 20 * 256);
            sheet.setColumnWidth(1, 25 * 256);
            sheet.setColumnWidth(2, 25 * 256);
            sheet.setColumnWidth(3, 25 * 256);
            sheet.setColumnWidth(4, 25 * 256);
            sheet.setColumnWidth(5, 25 * 256);
            sheet.setColumnWidth(6, 25 * 256);
            sheet.setColumnWidth(7, 25 * 256);
            sheet.setColumnWidth(8, 25 * 256);

            // CREATE HEADER
            CellStyle tableHeadStyle = workbook.createCellStyle();
            tableHeadStyle.setAlignment(HorizontalAlignment.LEFT);

            // HEADER FONT
            Font tableHeadFont = workbook.createFont();
            tableHeadFont.setBold(true);
            tableHeadStyle.setFont(tableHeadFont);

            Row header = sheet.createRow(2);

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

            Drawing<?> drawing = sheet.createDrawingPatriarch();
            insertImageToCell(workbook, "xlsx", drawing);

            CellStyle horizontalRowCenter = workbook.createCellStyle();
            horizontalRowCenter.setAlignment(HorizontalAlignment.LEFT);
            horizontalRowCenter.setVerticalAlignment(VerticalAlignment.CENTER);

            Row row1 = sheet.createRow(0);
            row1.setHeight((short) 1500);
            Cell pictureCell = row1.createCell(1);
            pictureCell.setCellValue("13 JP. Rizal St., Bayan Walk Arcade, Poblacion Dos, City of Cabuyao, Laguna");
            pictureCell.setCellStyle(horizontalRowCenter);

            int rowCount = 3;

            for (Timesheet timesheet : timesheets) {

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
                if (timesheet.getUser() != null) {

                    row.createCell(5).setCellValue(timesheet.getUser().getLastName() + ", " + timesheet.getUser().getFirstName()
                    + ((timesheet.getUser().getMiddleName() == null ? "" : " " + timesheet.getUser().getMiddleName())));
                    row.getCell(5).setCellStyle(horizontalRowLeft);

                    row.createCell(6).setCellValue(timesheet.getUser().getStudentNo());
                    row.getCell(6).setCellStyle(horizontalRowLeft);
                }
                if (timesheet.getUser().getSection() != null) {

                    row.createCell(7).setCellValue(timesheet.getUser().getSection().getName());
                    row.getCell(7).setCellStyle(horizontalRowLeft);

                    row.createCell(8).setCellValue(timesheet.getUser().getSection().getCourse().getName());
                    row.getCell(8).setCellStyle(horizontalRowLeft);
                }
            }

            workbook.write(out);

            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to import data to Excel file: " + e.getMessage());
        }
    }

    public void insertImageToCell(SXSSFWorkbook workbook, String fileType, Drawing<?> drawing) throws IOException {
 
        //Loading image from application
        File file = new File("asset/img/logo/school_logo.png");
        InputStream is = new FileInputStream(file);
 
        //Converting input stream into byte array
        byte[] inputImageBytes = IOUtils.toByteArray(is);
        int inputImagePictureID = workbook.addPicture(inputImageBytes, SXSSFWorkbook.PICTURE_TYPE_PNG);
        is.close();

        ClientAnchor anchor = new XSSFClientAnchor();

        anchor.setCol1(0);
        anchor.setCol2(1);
        anchor.setRow1(0);
        anchor.setRow2(1);
        drawing.createPicture(anchor, inputImagePictureID);
    }
}
