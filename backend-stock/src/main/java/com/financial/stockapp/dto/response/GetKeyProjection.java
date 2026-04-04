package com.financial.stockapp.dto.response;

import java.time.LocalDateTime;

public interface GetKeyProjection {
    Integer getId();
    String getApiKey();
    String getSecretKey();
    String getNameAccount();
    LocalDateTime getCreatedAt();
    Boolean getIsActive();
}