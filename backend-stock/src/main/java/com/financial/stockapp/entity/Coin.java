package com.financial.stockapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "coins")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Coin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 20)
    private String symbol; // 'BTC', 'ETH', 'BNB'

    @Column(nullable = false, length = 50)
    private String name; // 'Bitcoin'

    @Column(name = "trading_pair", nullable = false, unique = true, length = 20)
    private String tradingPair; // 'BTCUSDT'

    @Column(name = "logo_url", length = 255)
    private String logoUrl;

    @Column(name = "is_active")
    private Boolean isActive = true;
}