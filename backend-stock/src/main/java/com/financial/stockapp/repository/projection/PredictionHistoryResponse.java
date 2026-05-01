package com.financial.stockapp.repository.projection;


import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PredictionHistoryResponse {
    BigDecimal getPredictedPrice();
    BigDecimal getActualPrice();
    String getSignalAi();
    Integer getIsCorrect();
    LocalDateTime getPredictedAt();
}