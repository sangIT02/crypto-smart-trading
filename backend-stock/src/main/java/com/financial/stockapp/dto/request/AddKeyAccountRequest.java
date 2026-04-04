package com.financial.stockapp.dto.request;

public record AddKeyAccountRequest(
        String nameAccount,
        String apiKey,
        String secretKey
) {
}
