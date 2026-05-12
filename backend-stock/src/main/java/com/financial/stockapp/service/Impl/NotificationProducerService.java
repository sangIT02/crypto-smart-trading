package com.financial.stockapp.service.Impl;

import com.financial.stockapp.config.RabbitMQConfig;
import com.financial.stockapp.dto.request.NotificationMessage;
import com.financial.stockapp.dto.request.NotificationRequest;
import com.financial.stockapp.entity.NotificationCampaign;
import com.financial.stockapp.repository.INotificationCampaignRepository;
import com.financial.stockapp.repository.IUserRepository;
import com.financial.stockapp.repository.Impl.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationProducerService {
    @Autowired
    private INotificationCampaignRepository campaignRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    // Annotation này cực kỳ quan trọng để đảm bảo tính toàn vẹn dữ liệu
    @Transactional
    public void sendNotification(NotificationRequest request, int adminId) {

        // 1. Xác định danh sách ID người nhận (Giải quyết bài toán gửi ALL hay gửi Nhóm)
        List<Long> targetIds = new ArrayList<>();
        if ("ALL".equalsIgnoreCase(request.getTargetType())) {
            // Lấy toàn bộ ID từ bảng users
            targetIds = userRepository.findAllIds();
        }

        // Kiểm tra an toàn: Nếu không có ai để gửi thì dừng luôn, tránh lỗi
        if (targetIds == null || targetIds.isEmpty()) {
            throw new IllegalArgumentException("Danh sách người nhận trống!");
        }

        // 2. Ghi sổ sách: Tạo Campaign và lưu vào DB với trạng thái PENDING
        NotificationCampaign campaign = NotificationCampaign.builder()
                .adminId(adminId)
                .title(request.getTitle())
                .content(request.getContent())
                .targetType(request.getTargetType())
                .totalTargetUsers(targetIds.size()) // Lưu tổng số lượng để sau này thống kê
                .status("PENDING")
                .build();

        // Lưu xuống DB để Hibernate sinh ra khóa chính (ID)
        campaign = campaignRepository.save(campaign);

        // 3. Đóng gói bưu kiện (DTO)
        NotificationMessage message = NotificationMessage.builder()
                .campaignId(campaign.getId()) // Lấy chính cái ID vừa sinh ra ở trên
                .title(campaign.getTitle())
                .content(campaign.getContent())
                .type(request.getType())
                .targetUserIds(targetIds) // Nhét danh sách hàng ngàn ID vào đây
                .build();

        // 4. Giao cho đơn vị vận chuyển (RabbitMQ)
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.NOTIF_EXCHANGE,
                RabbitMQConfig.NOTIF_ROUTING_KEY,
                message
        );

    }
}
