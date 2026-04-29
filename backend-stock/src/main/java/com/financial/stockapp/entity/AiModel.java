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

    @Column(name = "model_id", nullable = false, length = 20)
    private String modelId; // 'XGBOOST', 'LSTM'

    @Column(name = "interval_type", nullable = false, length = 10)
    private String intervalType; // '1d', '4h'

    @Column(name = "model_name", length = 255)
    private String modelName;

    @Column(name = "mae")
    private double mae;

    @Column(name = "rmse")
    private double rmse;

    @Column(name = "mape")
    private double mape;

    @Column(name = "direction_acc")
    private double directionAcc;

    @CreationTimestamp
    @Column(name = "trained_at", updatable = false)
    private LocalDateTime trainedAt;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "task_id")
    private String taskId;

    @Column(name = "status")
    private String status;

    @Column(name = "limit_data")
    private int limitData;

    @Column(name = "time_step")
    private int timeStep;
}