package com.ctg.dtr.service.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Optional;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ctg.dtr.model.Image;
import com.ctg.dtr.model.User;
import com.ctg.dtr.repository.ImageRepository;
import com.ctg.dtr.repository.UserRepository;
import com.ctg.dtr.service.ImageService;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
	public Image uploadImage(MultipartFile multipartFile, Long userId) {

        Optional<User> user = userRepository.findById(userId);

        InputStream inputStream = null;
		OutputStream outputStream = null;

        File filePath = new File("asset/img/");

        String fileName;

        if(user.isPresent()) {
            fileName = user.get().getLastName() + "_" 
            + user.get().getStudentNo() + "." 
            + FilenameUtils.getExtension(multipartFile.getOriginalFilename());
        } else {
            fileName = multipartFile.getOriginalFilename();
        }

		File newFile = new File(filePath.getAbsolutePath(), fileName);

		try {
			inputStream = multipartFile.getInputStream();

			if (!newFile.exists()) {
				newFile.createNewFile();
			}

			outputStream = new FileOutputStream(newFile);
			int read = 0;
			byte[] bytes = new byte[1024];

			while ((read = inputStream.read(bytes)) != -1) {
				outputStream.write(bytes, 0, read);
			}

            inputStream.close();
			outputStream.close();
		}

		catch (IOException e) {
			e.printStackTrace();
		}

        Image image = new Image();

        image.setName(fileName);
        image.setType(multipartFile.getContentType());
		image.setPath(String.valueOf(newFile.getAbsolutePath()));
        image.setUser(user.isPresent() ? user.get() : null);
        
		return imageRepository.save(image);
	}

    @Override
	public Image getUserByStudentNo(String studentNo) {
        return imageRepository.findByUserStudentNo(studentNo);
    }
}
