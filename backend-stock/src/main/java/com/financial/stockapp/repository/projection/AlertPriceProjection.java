package com.financial.stockapp.repository.projection;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface AlertPriceProjection {
    Long getId();
    String getSymbol();
    String getConditionType();
    BigDecimal getTargetPrice();
    String getAlertMode();
    String getNote();
    Integer getIsTriggered();
    Integer getIsActive();
    LocalDateTime getCreatedAt();
    LocalDateTime getTriggeredAt();
}