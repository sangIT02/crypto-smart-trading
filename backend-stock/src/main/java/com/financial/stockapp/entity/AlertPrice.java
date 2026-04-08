package com.financial.stockapp.entity;

import com.financial.stockapp.entity.enums.AlertMode;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_alerts")
@Data // Dùng Lombok để tự tạo Getter/Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "coin_id", nullable = false)
    private Long coinId;

    @Column(name = "symbol", length = 20) // Thêm symbol (BTCUSDT) để dễ truy vấn socket
    private String symbol;

    @Column(name = "condition_type", length = 10) // ABOVE hoặc BELOW
    private String conditionType;

    @Column(name = "target_price", precision = 20, scale = 8)
    private BigDecimal targetPrice;

    @Column(name = "alert_mode", length = 15)
    private String alertMode;

    @Column(name = "is_triggered")
    private Integer isTriggered = 0; // 0: chưa nổ, 1: đã nổ (dùng cho loại ONCE)

    @Column(name = "is_active")
    private Integer isActive = 1; // 1: đang bật, 0: tạm dừng

    @Column(name = "triggered_at")
    private LocalDateTime triggeredAt;

    @Column(name = "note", length = 500) // Cho phép ghi chú tối đa 500 ký tự
    private String note;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Tự động gán ngày tạo khi insert
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}