package com.financial.stockapp.dto.request;

import lombok.Data;

@Data
public class ChatMessageRequest {
    private String session_id;
    private String message;
}
