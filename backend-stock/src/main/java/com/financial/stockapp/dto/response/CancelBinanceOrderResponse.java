package com.financial.stockapp.dto.response;

import java.math.BigDecimal;

public record CancelBinanceOrderResponse(
        Long orderId,
        String symbol,
        String status,
        BigDecimal executedQty,
        BigDecimal cumQuote,
        BigDecimal avgPrice,
        Long updateTime
) {
}