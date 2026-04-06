package com.financial.stockapp.dto.request;

public record ChangeLeverageRequest(
        String symbol,
        int leverage
) {
}
