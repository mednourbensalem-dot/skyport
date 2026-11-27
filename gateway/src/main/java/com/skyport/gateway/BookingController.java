package com.skyport.gateway;

import com.skyport.proto.Flight;
import com.skyport.proto.FlightRequest;
import com.skyport.proto.FlightServiceGrpc;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * REST in, SOAP out. The price base comes from the flight service (gRPC),
 * the booking, seat map and check-in are handled by the booking service (SOAP).
 */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    public record BookingRequest(String flightNumber, String passengerName, String email, String seatClass, String seat) {}
    public record CheckInRequest(String seat) {}

    private final FlightServiceGrpc.FlightServiceBlockingStub flights;
    private final SoapBookingClient soap;
    private final ActivityHub activity;

    public BookingController(FlightServiceGrpc.FlightServiceBlockingStub flights, SoapBookingClient soap,
                             ActivityHub activity) {
        this.flights = flights;
        this.soap = soap;
        this.activity = activity;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> create(@RequestBody BookingRequest r) {
        if (blank(r.flightNumber()) || blank(r.passengerName()) || blank(r.email()) || blank(r.seatClass())) {
            throw new IllegalArgumentException("Enter the passenger name, email and seat class.");
        }
        Flight flight = flights.withDeadlineAfter(3, TimeUnit.SECONDS)
                .getFlight(FlightRequest.newBuilder().setFlightNumber(r.flightNumber()).build());
        Map<String, Object> booking = soap.book(flight.getFlightNumber(), r.passengerName().trim(),
                r.email().trim(), r.seatClass(), flight.getBasePrice(), r.seat());
        activity.publish("BOOKED", String.valueOf(booking.get("reference")),
                flight.getFlightNumber(), r.passengerName().trim());
        return booking;
    }

    @GetMapping
    public Map<String, Object> list(@RequestParam String email) {
        if (blank(email)) throw new IllegalArgumentException("An email address is required.");
        List<Map<String, Object>> bookings = soap.list(email.trim());
        return Map.of("bookings", bookings);
    }

    @GetMapping("/{reference}")
    public Map<String, Object> get(@PathVariable String reference) {
        return soap.get(reference);
    }

    @DeleteMapping("/{reference}")
    public Map<String, Object> cancel(@PathVariable String reference) {
        Map<String, Object> booking = soap.cancel(reference);
        activity.publish("CANCELLED", String.valueOf(booking.get("reference")),
                String.valueOf(booking.get("flightNumber")), String.valueOf(booking.get("passengerName")));
        return booking;
    }

    @PostMapping("/{reference}/checkin")
    public Map<String, Object> checkIn(@PathVariable String reference,
                                       @RequestBody(required = false) CheckInRequest body) {
        String seat = body == null ? null : body.seat();
        Map<String, Object> booking = soap.checkIn(reference, seat);
        activity.publish("CHECKED_IN", String.valueOf(booking.get("reference")),
                String.valueOf(booking.get("flightNumber")), String.valueOf(booking.get("passengerName")));
        return booking;
    }

    private static boolean blank(String s) {
        return s == null || s.isBlank();
    }
}
