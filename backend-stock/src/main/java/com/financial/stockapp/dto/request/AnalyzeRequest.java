package com.financial.stockapp.dto.request;

public record AnalyzeRequest(
        PredictionData prediction,
        double capital,
        String risk   // 1 = LOW, 2 = MEDIUM, 3 = HIGH
) {}