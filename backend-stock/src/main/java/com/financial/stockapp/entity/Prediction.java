package com.financial.stockapp.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", nullable = false)
    private Model model;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coin_id", nullable = false)
    private Coin coin;

    @Column(name = "interval_type", nullable = false, length = 10)
    private String intervalType; // '1d', '4h'

    @Column(name = "current_price", nullable = false, precision = 20, scale = 8)
    private BigDecimal currentPrice;

    @Column(name = "predicted_price", nullable = false, precision = 20, scale = 8)
    private BigDecimal predictedPrice;

    @Column(name = "actual_price", precision = 20, scale = 8)
    private BigDecimal actualPrice;

    @Column(name = "change_pct", precision = 10, scale = 4)
    private BigDecimal changePct;

    @Column(name = "signal_ai",nullable = false, length = 10)
    private String signal_ai; // 'BUY', 'SELL', 'HOLD'

    @Column(precision = 5, scale = 2)
    private BigDecimal confidence;

    @Column(name = "is_correct")
    private int isCorrect;

    @CreationTimestamp
    @Column(name = "predicted_at", updatable = false)
    private LocalDateTime predictedAt;

    @Column(name = "target_time")
    private LocalDateTime targetTime;
}