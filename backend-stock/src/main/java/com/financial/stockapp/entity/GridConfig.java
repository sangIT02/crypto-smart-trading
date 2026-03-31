package com.financial.stockapp.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "grid_configs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GridConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coin_id", nullable = false)
    private Coin coin;

    @Column(name = "lower_price", nullable = false, precision = 20, scale = 8)
    private BigDecimal lowerPrice;

    @Column(name = "upper_price", nullable = false, precision = 20, scale = 8)
    private BigDecimal upperPrice;

    @Column(name = "grid_count", nullable = false)
    private Integer gridCount;

    @Column(name = "amount_per_grid", nullable = false, precision = 20, scale = 8)
    private BigDecimal amountPerGrid;

    @Column(name = "stop_loss", precision = 20, scale = 8)
    private BigDecimal stopLoss;

    @Column(name = "total_investment", precision = 20, scale = 8)
    private BigDecimal totalInvestment;

    @Column(name = "total_profit", precision = 20, scale = 8)
    private BigDecimal totalProfit = BigDecimal.ZERO;

    @Column(name = "total_trades")
    private Integer totalTrades = 0;

    @Column(name = "is_active")
    private Boolean isActive = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}