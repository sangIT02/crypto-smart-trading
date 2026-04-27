package com.financial.stockapp.util;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class GenerateUUID {
    public String createSimpleId() {
        return UUID.randomUUID().toString();
    }
}
