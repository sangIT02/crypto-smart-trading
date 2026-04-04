package com.financial.stockapp.dto.request;

public record ChangeMarginTypeRequest(
        String symbol,
        String marginType

) {
}
