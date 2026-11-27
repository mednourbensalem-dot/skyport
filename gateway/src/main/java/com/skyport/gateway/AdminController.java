package com.skyport.gateway;

import com.skyport.proto.Empty;
import com.skyport.proto.FlightServiceGrpc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/** JWT-protected operations console API. Requires ROLE_ADMIN. */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final FlightServiceGrpc.FlightServiceBlockingStub flights;
    private final SoapBookingClient soap;

    public AdminController(FlightServiceGrpc.FlightServiceBlockingStub flights, SoapBookingClient soap) {
        this.flights = flights;
        this.soap = soap;
    }

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("fleet", Json.map(flights.withDeadlineAfter(3, TimeUnit.SECONDS).fleetStats(Empty.getDefaultInstance())));
        out.put("bookings", soap.stats());
        out.put("generatedAt", Instant.now().toString());
        return out;
    }
}
