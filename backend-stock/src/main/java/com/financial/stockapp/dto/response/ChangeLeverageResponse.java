package com.financial.stockapp.dto.response;

public record ChangeLeverageResponse(
        int leverage,
        String maxNotionalValue,
        String symbol
) {
}
