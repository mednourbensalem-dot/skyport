package com.skyport.gateway;

import com.skyport.proto.Flight;
import com.skyport.proto.FlightRequest;
import com.skyport.proto.FlightServiceGrpc;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * REST in, SOAP out. The price base comes from the flight service (gRPC),
 * the booking itself is stored by the booking service (SOAP).
 */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    public record BookingRequest(String flightNumber, String passengerName, String email, String seatClass) {}

    private final FlightServiceGrpc.FlightServiceBlockingStub flights;
    private final SoapBookingClient soap;

    public BookingController(FlightServiceGrpc.FlightServiceBlockingStub flights, SoapBookingClient soap) {
        this.flights = flights;
        this.soap = soap;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> create(@RequestBody BookingRequest r) {
        if (blank(r.flightNumber()) || blank(r.passengerName()) || blank(r.email()) || blank(r.seatClass()))
            throw new IllegalArgumentException("Enter the passenger name, email and seat class.");
        Flight flight = flights.withDeadlineAfter(3, TimeUnit.SECONDS)
                .getFlight(FlightRequest.newBuilder().setFlightNumber(r.flightNumber()).build());
        return soap.book(flight.getFlightNumber(), r.passengerName().trim(), r.email().trim(),
                r.seatClass(), flight.getBasePrice());
    }

    @GetMapping("/{reference}")
    public Map<String, Object> get(@PathVariable String reference) {
        return soap.get(reference);
    }

    @DeleteMapping("/{reference}")
    public Map<String, Object> cancel(@PathVariable String reference) {
        return soap.cancel(reference);
    }

    private static boolean blank(String s) {
        return s == null || s.isBlank();
    }
}
