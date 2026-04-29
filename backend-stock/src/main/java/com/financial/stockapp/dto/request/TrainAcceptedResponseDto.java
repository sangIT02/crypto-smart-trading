package com.financial.stockapp.dto.request;

import lombok.Data;

@Data
public class TrainAcceptedResponseDto {
    private String task_id;
    private String status;  // Sẽ là "processing"
    private String message;
}
