package com.financial.stockapp.repository;

import com.financial.stockapp.dto.response.CoinInfoResponse;
import com.financial.stockapp.entity.Coin;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ICoinRepository extends JpaRepository<Coin, Long> {
    boolean existsBySymbol(String symbol);

    Coin findCoinByName(String name);

    Coin findCoinBySymbol(String symbol);

    Coin findCoinByTradingPair(String tradingPair);

    @Query(value = "SELECT " +
            "id, " +
            "symbol, " +
            "name, " +
            "trading_pair AS tradingPair, " +
            "logo_url AS logoUrl, " +
            "is_active AS isActive " +
            "FROM coins",
            nativeQuery = true)
    Slice<CoinInfoResponse> getAllCoinInfo(Pageable pageable);
}