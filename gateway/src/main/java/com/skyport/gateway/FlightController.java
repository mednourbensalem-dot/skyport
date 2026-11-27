package com.skyport.gateway;

import com.skyport.proto.Empty;
import com.skyport.proto.FlightRequest;
import com.skyport.proto.FlightServiceGrpc;
import com.skyport.proto.SearchRequest;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.concurrent.TimeUnit;

/** REST face of the platform. Catalog data comes from the gRPC flight service. */
@RestController
@RequestMapping("/api")
public class FlightController {
    private static final long DEADLINE_SECONDS = 3;

    private final FlightServiceGrpc.FlightServiceBlockingStub flights;
    private final TelemetryHub hub;

    public FlightController(FlightServiceGrpc.FlightServiceBlockingStub flights, TelemetryHub hub) {
        this.flights = flights;
        this.hub = hub;
    }

    @GetMapping(value = "/flights", produces = MediaType.APPLICATION_JSON_VALUE)
    public String listFlights() {
        return Json.of(flights.withDeadlineAfter(DEADLINE_SECONDS, TimeUnit.SECONDS)
                .listFlights(Empty.getDefaultInstance()));
    }

    @GetMapping(value = "/flights/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public String searchFlights(@RequestParam(defaultValue = "") String from,
                                @RequestParam(defaultValue = "") String to) {
        return Json.of(flights.withDeadlineAfter(DEADLINE_SECONDS, TimeUnit.SECONDS)
                .searchFlights(SearchRequest.newBuilder()
                        .setOrigin(from)
                        .setDestination(to)
                        .build()));
    }

    @GetMapping(value = "/flights/{number}", produces = MediaType.APPLICATION_JSON_VALUE)
    public String getFlight(@PathVariable String number) {
        return Json.of(flights.withDeadlineAfter(DEADLINE_SECONDS, TimeUnit.SECONDS)
                .getFlight(FlightRequest.newBuilder().setFlightNumber(number).build()));
    }

    @GetMapping(value = "/fleet/stats", produces = MediaType.APPLICATION_JSON_VALUE)
    public String fleetStats() {
        return Json.of(flights.withDeadlineAfter(DEADLINE_SECONDS, TimeUnit.SECONDS)
                .fleetStats(Empty.getDefaultInstance()));
    }

    @GetMapping(value = "/telemetry", produces = MediaType.APPLICATION_JSON_VALUE)
    public String telemetry() {
        return "[" + String.join(",", hub.snapshot()) + "]";
    }

    @GetMapping(value = "/telemetry/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter telemetryStream() {
        return hub.subscribe();
    }
}
