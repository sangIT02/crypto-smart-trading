package com.financial.stockapp.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BinanceAccountResponse(
        Boolean canTrade,
        Boolean canWithdraw,

        // -- Các thông số số dư chính --
        BigDecimal totalWalletBalance,
        BigDecimal totalUnrealizedProfit,
        BigDecimal totalMarginBalance,
        BigDecimal availableBalance,
        List<BinanceAssetDto> assets,
        List<BinancePositionDto> positions
) {}