package com.financial.stockapp.dto.request;

import lombok.Data;

@Data
public class SepayWebhookRequest {
    private Long id;
    private String gateway;
    private String transactionDate;
    private String accountNumber;
    private String code;
    private String content;
    private String transferType;   // "in" hoặc "out"
    private Long transferAmount;
    private Long accumulated;
    private String referenceCode;
}