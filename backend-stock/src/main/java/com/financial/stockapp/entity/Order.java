package com.financial.stockapp.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
@Table(name = "orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coin_id", nullable = false)
    private Coin coin;

    @Column(name = "binance_order_id", length = 100)
    private String binanceOrderId;

    @Column(nullable = false, length = 10)
    private String side; // 'BUY', 'SELL'

    @Column(nullable = false, length = 20)
    private String type; // 'MARKET', 'LIMIT'

    @Column(nullable = false, precision = 20, scale = 8)
    private BigDecimal quantity;

    @Column(precision = 20, scale = 8)
    private BigDecimal price; // NULL nếu Market order

    @Column(name = "executed_price", precision = 20, scale = 8)
    private BigDecimal executedPrice;

    @Column(name = "stop_loss", precision = 20, scale = 8)
    private BigDecimal stopLoss;

    @Column(name = "take_profit", precision = 20, scale = 8)
    private BigDecimal takeProfit;

    @Column(precision = 20, scale = 8)
    private BigDecimal pnl;

    @Column(nullable = false, length = 20)
    private String status; // 'PENDING', 'FILLED', 'CANCELLED'

    @Column(length = 20)
    private String source = "MANUAL"; // 'MANUAL', 'BOT', 'GRID', 'AI_SUGGEST'

    @Column(columnDefinition = "TEXT")
    private String note;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}