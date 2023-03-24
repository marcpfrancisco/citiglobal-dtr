package com.ctg.dtr.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

public class EmailService {

  @Autowired
  private JavaMailSender javaMailSender;

  public EmailService(JavaMailSender javaMailSender) {
    this.javaMailSender = javaMailSender;
  }

  public void sendHtmlEmail(String to, String subject, String templateName, Map<String, String> params)
      throws MessagingException, IOException {
    MimeMessage message = javaMailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true);
    helper.setFrom(new InternetAddress("iamhitman15@gmail.com"));
    helper.setTo(to);
    helper.setSubject(subject);

    String htmlContent = readHtmlContent(templateName);
    for (Map.Entry<String, String> entry : params.entrySet()) {
      String key = entry.getKey();
      String value = entry.getValue();
      htmlContent = htmlContent.replace("{{" + key + "}}", value);
    }

    helper.setText(htmlContent, true);
    javaMailSender.send(message);
  }

  private String readHtmlContent(String templateName) throws IOException {
    ClassPathResource resource = new ClassPathResource(templateName);
    byte[] bytes = resource.getInputStream().readAllBytes();
    return new String(bytes, StandardCharsets.UTF_8);
  }

}
