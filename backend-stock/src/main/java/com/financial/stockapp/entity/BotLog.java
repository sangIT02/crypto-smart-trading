package com.financial.stockapp.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bot_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BotLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bot_config_id", nullable = false)
    private BotConfig botConfig;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prediction_id")
    private Prediction prediction;

    @Column(nullable = false, length = 20)
    private String action; // 'BUY', 'SELL', 'SKIP'

    @Column(columnDefinition = "TEXT")
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(precision = 20, scale = 8)
    private BigDecimal profit;

    @Column(nullable = false, length = 30)
    private String status; // 'WAITING_CONFIRM', 'EXECUTED', 'REJECTED'

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}