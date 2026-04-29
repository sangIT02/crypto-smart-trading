package com.financial.stockapp.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
class ModelMetrics {
    private double mae;
    private double rmse;
    //private double mape;
    @JsonProperty("direction_acc")
    private double directionAcc;
}
