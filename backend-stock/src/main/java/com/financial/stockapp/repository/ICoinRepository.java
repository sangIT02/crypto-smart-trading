package com.financial.stockapp.repository;

import com.financial.stockapp.entity.Coin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICoinRepository extends JpaRepository<Coin, Long> {
    boolean existsBySymbol(String symbol);

    Coin findCoinByName(String name);

    Coin findCoinBySymbol(String symbol);

    Coin findCoinByTradingPair(String tradingPair);
}