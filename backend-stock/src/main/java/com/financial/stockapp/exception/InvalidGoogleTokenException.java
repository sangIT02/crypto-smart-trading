package com.financial.stockapp.exception;

public class InvalidGoogleTokenException extends RuntimeException {

    public InvalidGoogleTokenException() {
        super("Invalid Google Token");
    }

    public InvalidGoogleTokenException(String message) {
        super(message);
    }
}