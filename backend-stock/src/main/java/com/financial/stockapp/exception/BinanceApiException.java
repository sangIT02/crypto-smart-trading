package com.financial.stockapp.exception;

public class BinanceApiException extends RuntimeException {
    private final int code;
    private final String msg;

    public BinanceApiException(int code, String msg) {
        super(msg);
        this.code = code;
        this.msg = msg;
    }

    public int getCode() { return code; }
    public String getMsg() { return msg; }
}