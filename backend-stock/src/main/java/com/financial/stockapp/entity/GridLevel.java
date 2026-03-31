package com.financial.stockapp.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "grid_levels")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GridLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grid_config_id", nullable = false)
    private GridConfig gridConfig;

    @Column(name = "price_level", nullable = false, precision = 20, scale = 8)
    private BigDecimal priceLevel;

    @Column(nullable = false, length = 10)
    private String side; // 'BUY', 'SELL'

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(length = 20)
    private String status = "WAITING"; // 'WAITING', 'FILLED', 'CANCELLED'

    @Column(precision = 20, scale = 8)
    private BigDecimal profit = BigDecimal.ZERO;

    @Column(name = "filled_at")
    private LocalDateTime filledAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}