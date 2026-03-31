package com.financial.stockapp.dto.request;

public record AddKeyAccountRequest(
        int UserID,
        String apiKey,
        String secretKey,
        String nameAccount
) {
}
