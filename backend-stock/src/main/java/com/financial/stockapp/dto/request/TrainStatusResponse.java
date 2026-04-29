package com.financial.stockapp.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
class TrainStatusResponse {
    @JsonProperty("task_id")
    private String taskId;
    private String status; // processing, completed, failed
    private ModelMetrics metrics;
    private String error;
}