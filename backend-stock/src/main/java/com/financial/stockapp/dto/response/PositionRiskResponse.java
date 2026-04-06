package com.financial.stockapp.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PositionRiskResponse(
        String symbol,
        String leverage,
        boolean isolated
) {}