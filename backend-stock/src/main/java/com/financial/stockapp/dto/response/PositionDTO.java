package com.financial.stockapp.dto.response;

public record PositionDTO(
        String symbol,
        String positionSide,
        String positionAmt,
        String entryPrice,
        String breakEvenPrice,
        String markPrice,
        String unRealizedProfit,
        String liquidationPrice,
        String isolatedMargin,
        String notional,
        String isolatedWallet,
        long updateTime,

        // --- Các trường bổ sung đặc trưng của V2 ---
        String leverage,           // Đòn bẩy hiện tại (Ví dụ: "10")
        String marginType,         // "isolated" hoặc "cross"
        String isAutoAddMargin,    // "true" hoặc "false"
        String maxNotionalValue    // Giá trị vị thế tối đa được phép ở mức leverage này
) {}