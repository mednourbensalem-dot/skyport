package com.skyport.gateway;

import io.grpc.StatusRuntimeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class ApiErrors {
    @ExceptionHandler(StatusRuntimeException.class)
    ResponseEntity<Map<String, String>> grpc(StatusRuntimeException e) {
        return switch (e.getStatus().getCode()) {
            case NOT_FOUND -> error(HttpStatus.NOT_FOUND, "That flight does not exist.");
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

    private ResponseEntity<Map<String, String>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("error", message));
    }
}
