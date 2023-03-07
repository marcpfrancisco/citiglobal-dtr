package com.ctg.dtr.controller;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ctg.dtr.model.Image;
import com.ctg.dtr.service.ImageService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/image")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN') or hasRole('USER')")
    @PostMapping(value = "/upload/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@RequestPart MultipartFile file, @PathVariable Long userId, HttpServletRequest request, HttpServletResponse response) {

        if ((file.getContentType()).startsWith("image/")) {

            Image image = imageService.uploadImage(file, userId);
            return new ResponseEntity<Image>(image, HttpStatus.CREATED);

        } else {

		    Map<String, Object> tempMap = new HashMap<String, Object>();

			response.setContentType(MediaType.MULTIPART_FORM_DATA_VALUE);
			response.setStatus(HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE);

			tempMap.put("status", HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE);
			tempMap.put("error", HttpStatus.UNSUPPORTED_MEDIA_TYPE);
			tempMap.put("message", "File is not an image.");
			tempMap.put("path", request.getServletPath());

			return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(tempMap);
        }
    }

    @SecurityRequirement(name = "Bearer Authentication")
	@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/user/info/{studentNo}")
	public void getUserImageDetails(@PathVariable String studentNo, HttpServletResponse response) {

        Image image = imageService.getUserByStudentNo(studentNo);
        
        String extension = FilenameUtils.getExtension(image.getName());

        switch (extension) {
            case "png":
                response.setContentType("image/png");
                break;
            case "jpeg":
                response.setContentType("image/jpeg");
                break;
            case "jpg":
                response.setContentType("image/jpg");
                break;
            default:
                response.setContentType("image/png");
        }

        try {
            InputStream is = new FileInputStream("asset/img/" + image.getName());
            IOUtils.copy(is, response.getOutputStream());
            response.flushBuffer();
        } catch (IOException ex) {
            throw new RuntimeException("IO Error writing file to output stream: " + ex);
        }
	}
}
