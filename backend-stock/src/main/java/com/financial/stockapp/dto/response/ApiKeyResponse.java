package com.financial.stockapp.dto.response;

import java.time.Instant;
import java.time.LocalDateTime;

public record ApiKeyResponse(
        int id,
        String apiKey,
        String secretKey,
        String nameAccount,
        LocalDateTime createdAt,
        boolean isActive
) {
}
