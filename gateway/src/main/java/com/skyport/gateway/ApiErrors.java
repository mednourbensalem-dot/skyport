package com.skyport.gateway;

import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class ApiErrors {
    @ExceptionHandler(StatusRuntimeException.class)
    ResponseEntity<Map<String, String>> grpc(StatusRuntimeException e) {
        return switch (e.getStatus().getCode()) {
            case NOT_FOUND -> error(HttpStatus.NOT_FOUND, "That flight does not exist.");
            case DEADLINE_EXCEEDED -> error(HttpStatus.GATEWAY_TIMEOUT, "Flight service took too long to answer.");
            default -> error(HttpStatus.SERVICE_UNAVAILABLE, "Flight service is unavailable. Try again in a moment.");
        };
    }

    @ExceptionHandler(SoapFaultException.class)
    ResponseEntity<Map<String, String>> soap(SoapFaultException e) {
        return error(HttpStatus.valueOf(e.status()), e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<Map<String, String>> bad(IllegalArgumentException e) {
        return error(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    ResponseEntity<Map<String, String>> missingParameter(MissingServletRequestParameterException e) {
        return error(HttpStatus.BAD_REQUEST, "Missing parameter: " + e.getParameterName());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<Map<String, String>> unreadable(HttpMessageNotReadableException e) {
        return error(HttpStatus.BAD_REQUEST, "The request body could not be read.");
    }

    private ResponseEntity<Map<String, String>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("error", message));
    }
}
