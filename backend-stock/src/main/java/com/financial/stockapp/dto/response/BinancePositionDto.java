package com.financial.stockapp.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BinancePositionDto(
        String symbol,
        String initialMargin,
        String maintMargin,
        String unrealizedProfit,
        String positionInitialMargin,
        String openOrderInitialMargin,
        String leverage,
        Boolean isolated,
        String entryPrice,
        String maxNotional,
        String bidNotional,
        String askNotional,
        String positionSide,
        String positionAmt,
        Long updateTime
) {}