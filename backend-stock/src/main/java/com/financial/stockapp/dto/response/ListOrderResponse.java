package com.financial.stockapp.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
@JsonIgnoreProperties(ignoreUnknown = true) // <--- Bùa hộ mệnh
public record ListOrderResponse(
        Long orderId,
        String symbol,
        String status,
        String clientOrderId,
        BigDecimal price,
        BigDecimal avgPrice,
        BigDecimal origQty,
        BigDecimal executedQty,
        BigDecimal cumQuote,
        String timeInForce,
        String type,
        boolean reduceOnly,
        boolean closePosition,
        String side,
        String positionSide,
        BigDecimal stopPrice,
        String workingType,
        boolean priceProtect,
        String origType,
        String priceMatch,
        String selfTradePreventionMode,
        Long goodTillDate,
        Long time,
        Long updateTime
) {
}