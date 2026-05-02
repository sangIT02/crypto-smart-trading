package com.financial.stockapp.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ChatResponse {
    private String sessionId;
    private String userMessage;
    private String assistantMessage;
    private LocalDateTime timestamp;
}