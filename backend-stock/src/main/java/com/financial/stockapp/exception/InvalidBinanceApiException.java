package com.financial.stockapp.exception;

public class InvalidBinanceApiException extends RuntimeException {

    public InvalidBinanceApiException() {
        super("Invalid Binance API key or secret key.");
    }

    public InvalidBinanceApiException(String message) {
        super(message);
    }
}