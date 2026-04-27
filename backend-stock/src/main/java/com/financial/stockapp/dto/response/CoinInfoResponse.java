package com.financial.stockapp.dto.response;

public interface CoinInfoResponse {
    Long getId();
    String getSymbol();
    String getName();
    String getTradingPair();
    String getLogoUrl();
    Boolean getIsActive();
}
