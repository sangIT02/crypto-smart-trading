package com.financial.stockapp.dto.response.FunctionDataResponse;

public record PriceMarketDataResponse(
        String symbol,
        String price,
        long time
) {
}
