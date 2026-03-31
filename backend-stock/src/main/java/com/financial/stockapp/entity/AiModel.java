package com.financial.stockapp.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_models")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AiModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coin_id", nullable = false)
    private Coin coin;

    @Column(name = "model_type", nullable = false, length = 20)
    private String modelType; // 'XGBOOST', 'LSTM'

    @Column(name = "interval_type", nullable = false, length = 10)
    private String intervalType; // '1d', '4h'

    @Column(name = "file_path", nullable = false, length = 255)
    private String filePath;

    @Column(precision = 20, scale = 8)
    private BigDecimal mae;

    @Column(precision = 20, scale = 8)
    private BigDecimal rmse;

    @Column(precision = 10, scale = 4)
    private BigDecimal mape;

    @Column(name = "direction_acc", precision = 10, scale = 4)
    private BigDecimal directionAcc;

    @CreationTimestamp
    @Column(name = "trained_at", updatable = false)
    private LocalDateTime trainedAt;

    @Column(name = "is_active")
    private Boolean isActive = true;
}