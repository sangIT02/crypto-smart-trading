package com.financial.stockapp.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AlertPriceResponse(
        Long id,
        String symbol,
        String conditionType,
        BigDecimal targetPrice,
        String alertMode,
        String note,
        Integer isTriggered,
        Integer isActive,
        LocalDateTime createdAt,
        LocalDateTime triggeredAt
) {}