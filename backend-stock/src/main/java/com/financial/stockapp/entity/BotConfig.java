package com.financial.stockapp.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bot_configs",
        uniqueConstraints = @UniqueConstraint(name = "uq_user_coin_bot", columnNames = {"user_id", "coin_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BotConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coin_id", nullable = false)
    private Coin coin;

    @Column(nullable = false, length = 30)
    private String strategy; // 'TREND', 'REVERSAL', 'AI', 'COMBINED'

    @Column(name = "is_active")
    private Boolean isActive = false;

    @Column(name = "trade_amount", nullable = false, precision = 20, scale = 8)
    private BigDecimal tradeAmount;

    @Column(name = "stop_loss_pct", precision = 5, scale = 2)
    private BigDecimal stopLossPct = new BigDecimal("2.0");

    @Column(name = "take_profit_pct", precision = 5, scale = 2)
    private BigDecimal takeProfitPct = new BigDecimal("3.0");

    @Column(name = "min_confidence", precision = 5, scale = 2)
    private BigDecimal minConfidence = new BigDecimal("70.0");

    @Column(name = "require_confirm")
    private Boolean requireConfirm = true; // true=Semi-auto, false=Full-auto

    @Column(name = "total_profit", precision = 20, scale = 8)
    private BigDecimal totalProfit = BigDecimal.ZERO;

    @Column(name = "total_trades")
    private Integer totalTrades = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}