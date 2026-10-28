package com.skyport.gateway;

public class SoapFaultException extends RuntimeException {
    private final int status;

    public SoapFaultException(String message, int status) {
        super(message);
        this.status = status;
    }

    public int status() {
        return status;
    }
}
