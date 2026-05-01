package com.financial.stockapp.repository.projection;

public interface SymbolOrderProjection {
    String getSymbol();
    Long getTotalOrders();
}
