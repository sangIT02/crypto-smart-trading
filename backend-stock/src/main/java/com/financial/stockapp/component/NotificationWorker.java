package com.financial.stockapp.component;

import com.financial.stockapp.config.RabbitMQConfig;
import com.financial.stockapp.dto.request.NotificationMessage;
import com.financial.stockapp.entity.Notification;
import com.financial.stockapp.entity.NotificationCampaign;
import com.financial.stockapp.repository.INotificationCampaignRepository;
import com.financial.stockapp.repository.INotificationRepository;
import jakarta.transaction.Transactional;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class NotificationWorker {

    @Autowired
    private INotificationRepository notificationRepository;

    @Autowired
    private INotificationCampaignRepository campaignRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @RabbitListener(queues = RabbitMQConfig.NOTIF_QUEUE)
    @Transactional
    public void processNotification(NotificationMessage message) {
        try {
            // 1. Đổi status thành PROCESSING
            updateCampaignStatus(message.getCampaignId(), "PROCESSING");
            NotificationCampaign nc = campaignRepository.findById(message.getCampaignId()).orElseThrow(() -> {
                return new RuntimeException("khoong tìm thấy NotificationCampaign");
            });

            // Bước 2: Lặp qua danh sách ID, biến mỗi ID thành 1 đối tượng Notification
            List<Notification> notificationsToSave = message.getTargetUserIds().stream().map(userId -> {
                return Notification.builder()
                        .userId(userId) // Gắn ID của user nhận
                        .campaign(nc) // Gắn ID của chiến dịch
                        .title(message.getTitle())
                        .content(message.getContent())
                        .type(message.getType())
                        .isRead(false) // Mặc định là chưa đọc
                        .build();
            }).collect(Collectors.toList());

            // Bước 3: Insert toàn bộ vào Database cùng 1 lúc (Batch Insert)
            // Lệnh này cực kỳ tối ưu, nó gom 1000 object lại và chạy 1 lệnh SQL duy nhất
            notificationRepository.saveAll(notificationsToSave);

            // ======================================================

            for (Notification notif : notificationsToSave) {
                // Định tuyến kênh gửi: /topic/user/{id}/notifications
                String destination = "/topic/user/" + notif.getUserId() + "/notifications";
                // Spring sẽ tự lo: Có người nghe thì gửi, không có thì vứt đi (Drop)
                messagingTemplate.convertAndSend(destination, notif);
            }
            // 4. Báo cáo hoàn thành
            updateCampaignStatus(message.getCampaignId(), "COMPLETED");
            System.out.println("Đã insert xong thông báo cho chiến dịch: " + message.getCampaignId());

        } catch (Exception e) {
            updateCampaignStatus(message.getCampaignId(), "FAILED");
            throw e; // Báo lỗi cho RabbitMQ biết
        }
    }

    private void updateCampaignStatus(Long campaignId, String status) {
        campaignRepository.findById(campaignId).ifPresent(campaign -> {
            campaign.setStatus(status);
            campaignRepository.save(campaign);
        });
    }
}