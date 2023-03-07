package com.ctg.dtr.service;

import org.springframework.web.multipart.MultipartFile;

import com.ctg.dtr.model.Image;

public interface ImageService {

    Image uploadImage(MultipartFile multipartFile, Long userId);

    Image getUserByStudentNo(String studentNo);

    // Image getImageDetails(String name);
}
