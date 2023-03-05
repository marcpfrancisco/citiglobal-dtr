package com.ctg.dtr.service;

import org.springframework.web.multipart.MultipartFile;

import com.ctg.dtr.model.Image;

public interface ImageService {

    Image uploadImage(MultipartFile multipartFile, Long userId);

    Image getUserByStudentId(String studentId);

    // Image getImageDetails(String name);
}
