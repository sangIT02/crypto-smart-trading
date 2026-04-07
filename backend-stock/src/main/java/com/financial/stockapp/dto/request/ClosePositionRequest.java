package com.financial.stockapp.dto.request;

public record ClosePositionRequest(
        String symbol,
        String side,
        String type,
        String quantity
) {
}
