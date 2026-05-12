package com.financial.stockapp.dto.response;

public record DashboardInfoResponse(
        Double pnl,
        Long order,
        int totalWarning
) {
}
