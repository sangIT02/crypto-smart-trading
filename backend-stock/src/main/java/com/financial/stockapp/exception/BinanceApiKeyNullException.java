package com.financial.stockapp.exception;

public class BinanceApiKeyNullException extends RuntimeException {

    public BinanceApiKeyNullException() {
        super("Binance API key is null or missing.");
    }

    public BinanceApiKeyNullException(String message) {
        super(message);
    }
}