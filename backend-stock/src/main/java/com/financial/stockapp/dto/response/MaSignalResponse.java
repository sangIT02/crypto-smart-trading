package com.financial.stockapp.dto.response;

import lombok.Getter;
import org.springframework.stereotype.Service;


public record MaSignalResponse(
        double sma7,
        double sma25,
        double sma99,
        double ema7,
        double ema25,
        double ema99,
        int sellSignal,
        int buySignal,
        int neutral,
        double marketPrice
        ) {
}
