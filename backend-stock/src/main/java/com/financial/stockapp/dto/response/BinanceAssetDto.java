package com.financial.stockapp.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BinanceAssetDto(
        String asset,
        String walletBalance,
        String unrealizedProfit,
        String marginBalance,
        String maintMargin,
        String initialMargin,
        String positionInitialMargin,
        String openOrderInitialMargin,
        String crossWalletBalance,
        String crossUnPnl,
        String availableBalance,
        String maxWithdrawAmount,
        Boolean marginAvailable,
        Long updateTime
) {}