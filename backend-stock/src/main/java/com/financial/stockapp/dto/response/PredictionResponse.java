package com.financial.stockapp.dto.response;

import lombok.Data;

@Data
public class PredictionResponse {
    private String  signal;
    private Double  predictedPrice;
    private Double  confidence;
    private Double  changePercent;
    private Double  directionAcc;
    private Double  mae;
    private Double  mape;
    private String  modelUsed;
}