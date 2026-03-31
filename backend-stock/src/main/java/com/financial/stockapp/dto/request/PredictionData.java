package com.financial.stockapp.dto.request;

public record PredictionData(
        String predictedPrice,
        String confidence,
        String signal,        // hoặc dùng enum (khuyến nghị bên dưới)
        String changePercent,
        String directionAcc,
        String mae,
        String mape
) {}