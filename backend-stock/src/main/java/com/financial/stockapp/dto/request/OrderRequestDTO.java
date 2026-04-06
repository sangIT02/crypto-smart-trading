package com.financial.stockapp.dto.request;

import lombok.Data;

@Data
public class OrderRequestDTO {
    private String symbol;
    private String side;
    private String type;
    private String timeInForce;
    private String price;
    private String quantity;
}