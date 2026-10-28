package com.skyport.gateway;

import com.skyport.proto.Empty;
import com.skyport.proto.Flight;
import com.skyport.proto.FlightRequest;
import com.skyport.proto.FlightServiceGrpc;
import com.skyport.proto.Telemetry;
import io.grpc.stub.StreamObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Keeps one gRPC server-stream open per flight and fans every update out to all browsers
 * over a single Server-Sent Events connection. Reconnects automatically if the flight service restarts.
 */
@Component
public class TelemetryHub {
    private static final Logger log = LoggerFactory.getLogger(TelemetryHub.class);

    private final FlightServiceGrpc.FlightServiceBlockingStub blocking;
    private final FlightServiceGrpc.FlightServiceStub async;
    private final Map<String, String> latest = new ConcurrentHashMap<>();
    private final List<SseEmitter> subscribers = new CopyOnWriteArrayList<>();
    private final ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();

    public TelemetryHub(FlightServiceGrpc.FlightServiceBlockingStub blocking, FlightServiceGrpc.FlightServiceStub async) {
        this.blocking = blocking;
        this.async = async;
    }

    @EventListener(ApplicationReadyEvent.class)
    void start() {
        executor.execute(this::connectAll);
    }

    private void connectAll() {
        try {
            for (Flight f : blocking.withDeadlineAfter(3, TimeUnit.SECONDS).listFlights(Empty.getDefaultInstance()).getFlightsList()) {
                open(f.getFlightNumber());
            }
            log.info("Streaming live telemetry over gRPC");
        } catch (Exception e) {
            log.warn("Flight service not reachable yet, retrying in 3s");
            executor.schedule(this::connectAll, 3, TimeUnit.SECONDS);
        }
    }

    private void open(String flightNumber) {
        async.streamTelemetry(FlightRequest.newBuilder().setFlightNumber(flightNumber).build(), new StreamObserver<>() {
            @Override public void onNext(Telemetry t) {
                String json = Json.of(t);
                latest.put(flightNumber, json);
                broadcast(json);
            }
            @Override public void onError(Throwable e) { retry(); }
            @Override public void onCompleted() { retry(); }
            private void retry() { executor.schedule(() -> open(flightNumber), 3, TimeUnit.SECONDS); }
        });
    }

    private void broadcast(String json) {
        for (SseEmitter s : subscribers) {
            try {
                s.send(json);
            } catch (Exception e) {
                subscribers.remove(s);
            }
        }
    }

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(0L);
        subscribers.add(emitter);
        emitter.onCompletion(() -> subscribers.remove(emitter));
        emitter.onTimeout(() -> subscribers.remove(emitter));
        emitter.onError(t -> subscribers.remove(emitter));
        for (String json : latest.values()) {
            try { emitter.send(json); } catch (Exception ignored) { }
        }
        return emitter;
    }

    public Collection<String> snapshot() {
        return latest.values();
    }
}
