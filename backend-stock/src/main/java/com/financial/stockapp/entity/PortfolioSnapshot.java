package com.financial.stockapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "portfolio_snapshots",
        uniqueConstraints = @UniqueConstraint(name = "uq_user_date", columnNames = {"user_id", "snapshot_date"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PortfolioSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "total_value", nullable = false, precision = 20, scale = 8)
    private BigDecimal totalValue;

    @Column(name = "total_pnl", precision = 20, scale = 8)
    private BigDecimal totalPnl;

    @Column(name = "total_pnl_pct", precision = 10, scale = 4)
    private BigDecimal totalPnlPct;

    @Column(name = "snapshot_date", nullable = false)
    private LocalDate snapshotDate;
}