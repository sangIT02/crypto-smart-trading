package com.financial.stockapp.dto.request;

import lombok.Data;

@Data
public class NotificationRequest {
    private String title;
    private String content;
    private String type;
    private String targetType; // "ALL", "SPECIFIC_USERS", "VIP"
}