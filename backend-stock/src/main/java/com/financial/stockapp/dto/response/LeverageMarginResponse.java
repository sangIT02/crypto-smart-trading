package com.financial.stockapp.dto.response;

import java.util.List;

public record LeverageMarginResponse(
        List<PositionRiskResponse> leverageMargin
) {
}
