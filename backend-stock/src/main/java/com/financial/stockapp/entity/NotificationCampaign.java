package com.financial.stockapp.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_campaigns")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationCampaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "admin_id", nullable = false)
    private int adminId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "target_type", length = 50)
    private String targetType; // Gợi ý: Nên dùng Enum (ALL, VIP, GROUP) thay vì String

    @Column(name = "total_target_users")
    private Integer totalTargetUsers;

    @Column(length = 20)
    private String status; // Gợi ý: Nên dùng Enum (PENDING, PROCESSING, COMPLETED, FAILED)

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}