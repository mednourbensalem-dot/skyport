package com.skyport.gateway;

import com.skyport.proto.Flight;
import com.skyport.proto.FlightRequest;
import com.skyport.proto.FlightServiceGrpc;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Fare quotes. The base price comes from the flight service (gRPC) and the rules
 * (cabin multiplier, taxes, seat fee) live in the booking service (SOAP), so the
 * browser sees exactly what will be charged.
 */
@RestController
@RequestMapping("/api/fare")
public class FareController {
    public record QuoteRequest(String flightNumber, String seatClass, Integer passengers, String seat) {}

    private final FlightServiceGrpc.FlightServiceBlockingStub flights;
    private final SoapBookingClient soap;

    public FareController(FlightServiceGrpc.FlightServiceBlockingStub flights, SoapBookingClient soap) {
        this.flights = flights;
        this.soap = soap;
    }

    @PostMapping("/quote")
    public Map<String, Object> quote(@RequestBody QuoteRequest req) {
        if (req.flightNumber() == null || req.flightNumber().isBlank()) {
            throw new IllegalArgumentException("Choose a flight first.");
        }
        Flight flight = flights.withDeadlineAfter(3, TimeUnit.SECONDS)
                .getFlight(FlightRequest.newBuilder().setFlightNumber(req.flightNumber()).build());
        String cabin = req.seatClass() == null || req.seatClass().isBlank() ? "ECONOMY" : req.seatClass();
        return soap.quote(flight.getBasePrice(), cabin,
                req.passengers() == null ? 1 : req.passengers(), req.seat());
    }
}
