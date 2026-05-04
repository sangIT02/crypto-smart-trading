package com.financial.stockapp.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RecentTradingPairDto {
    private String symbol;
    private Double percent;
}
