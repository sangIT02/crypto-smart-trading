package com.financial.stockapp.repository.projection;

public interface CoinInfoResponse {
    Long getId();
    String getSymbol();
    String getName();
    String getTradingPair();
    String getLogoUrl();
    Boolean getIsActive();
}
