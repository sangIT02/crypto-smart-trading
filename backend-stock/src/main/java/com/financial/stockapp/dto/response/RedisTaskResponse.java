package com.financial.stockapp.dto.response;

import lombok.Data;

@Data
public class RedisTaskResponse {
    private String status;
    private TrainingMetrics metrics;
    private String error;
}