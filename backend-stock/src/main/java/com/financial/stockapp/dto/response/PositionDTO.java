package com.financial.stockapp.dto.response;

public record PositionDTO(
        String symbol,
        String positionSide, // Có thể cân nhắc tạo Enum cho "BOTH", "LONG", "SHORT"
        String positionAmt,
        String entryPrice,
        String breakEvenPrice,
        String markPrice,
        String unRealizedProfit,
        String liquidationPrice,
        String isolatedMargin,
        String notional,
        String marginAsset,
        String isolatedWallet,
        String initialMargin,
        String maintMargin,
        String positionInitialMargin,
        String openOrderInitialMargin,
        int adl,
        String bidNotional,
        String askNotional,
        long updateTime
) {}