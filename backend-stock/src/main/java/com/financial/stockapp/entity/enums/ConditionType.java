package com.financial.stockapp.entity.enums;

public enum ConditionType {
    PRICE_ABOVE("Giá tăng trên"),
    PRICE_BELOW("Giá giảm dưới"),
    MA_CROSS("Trung bình động (MA)");

    private final String displayName;
    ConditionType(String displayName) {
        this.displayName = displayName;
    }
}
