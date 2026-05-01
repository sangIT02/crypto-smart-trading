package com.financial.stockapp.dto.response;

public record DashboardStatsResponse(
        long totalUsers,
        double userChange,
        long totalOrders,
        double orderChange,
        int totalModels,
        double modelChange,
        int alerts,
        double alertChange
) {}
