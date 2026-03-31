package com.financial.stockapp.dto.response;

import com.financial.stockapp.entity.enums.Verdict;

import java.util.List;

public record AnalyzeResponse(
        Verdict verdict,
        String verdictReason,

        int leverage,
        String leverageReason,

        double entryPrice,
        double stopLoss,
        double stopLossPercent,

        double takeProfit1,
        double takeProfit2,
        double takeProfit3,

        double tpPercent1,
        double tpPercent2,
        double tpPercent3,

        double riskRewardRatio,

        double maxLoss,
        double positionSize,
        double positionSizePercent,

        List<String> warnings,

        String analysis
) {}