package com.financial.stockapp.service.Impl;

import com.financial.stockapp.service.IMailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService implements IMailService {
    private final JavaMailSender javaMailSender;

    public void sentOPTMail(String toMail, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toMail);
            message.setSubject("Mã xác thực OTP của bạn");
            message.setText("Mã OTP của bạn là: " + otpCode + "\n\nMã này sẽ hết hạn sau 5 phút.");

            javaMailSender.send(message);
            log.info("Đã gửi OTP tới {}", toMail);
        } catch (Exception e) {
            log.error("Lỗi gửi mail", e);
        }
    }
}
