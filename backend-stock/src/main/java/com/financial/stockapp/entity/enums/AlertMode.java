package com.financial.stockapp.entity.enums;

public enum AlertMode {
    ONCE("Chỉ báo một lần"),
    RECURRING("Lặp lại (kèm cooldown)");

    private final String description;

    AlertMode(String description) {
        this.description = description;
    }
}