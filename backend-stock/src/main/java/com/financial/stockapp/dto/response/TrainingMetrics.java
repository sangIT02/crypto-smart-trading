package com.financial.stockapp.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TrainingMetrics {
    @JsonProperty("model_name")
    private String modelName;
    private Double mae;
    private Double rmse;
    @JsonProperty("direction_acc")
    private Double directionAcc;
}