package com.financial.stockapp.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PredictionHistoryResponse {
    BigDecimal getPredictedPrice();
    BigDecimal getActualPrice();
    String getSignalAi();
    Integer getIsCorrect();
    LocalDateTime getPredictedAt();
}