package com.financial.stockapp.dto.request;

import com.financial.stockapp.entity.enums.AlertMode;
import com.financial.stockapp.entity.enums.ConditionType;

import java.math.BigDecimal;

public record AlertCreateRequest(
        String symbol,         // Ví dụ: "BTCUSDT" (để tiện cho Socket)
        ConditionType conditionType,  // "ABOVE" hoặc "BELOW"
        BigDecimal targetPrice,// Giá mục tiêu
        AlertMode alertMode,  // "ONCE" hoặc "RECURRING"
        String note            // Ghi chú cá nhân
) {}