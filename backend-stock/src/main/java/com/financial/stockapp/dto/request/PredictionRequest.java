package com.financial.stockapp.dto.request;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PredictionRequest {
    private String       symbol;
    private String       timeframe;
    private String       model;
    private List<List<Object>> candles;
    private Double currentPrice;
}