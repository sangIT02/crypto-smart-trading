package com.financial.stockapp.controller;

import com.financial.stockapp.dto.request.NotificationRequest;
import com.financial.stockapp.service.Impl.NotificationProducerService;
import com.financial.stockapp.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/notifications")
public class NotificationController {

    @Autowired
    private NotificationProducerService producerService;

    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationRequest request) {
        // Giả sử lấy adminId từ Token bảo mật (ở đây mình fix cứng là 1 để test)
        int currentAdminId = SecurityUtils.getCurrentUserId();

        // Gọi Service đẩy tin nhắn vào RabbitMQ
        producerService.sendNotification(request, currentAdminId);

        // Phản hồi ngay lập tức cho Admin
        return ResponseEntity.ok("Lệnh gửi thông báo đã được đưa vào hàng đợi xử lý thành công!");
    }
}