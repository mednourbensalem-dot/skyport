package com.skyport.booking;

import org.springframework.ws.soap.server.endpoint.annotation.FaultCode;
import org.springframework.ws.soap.server.endpoint.annotation.SoapFault;

/** Becomes a SOAP Fault (client error) with the message as faultstring. */
@SoapFault(faultCode = FaultCode.CLIENT)
public class BookingException extends RuntimeException {
    public BookingException(String message) {
        super(message);
    }
}
