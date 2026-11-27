package com.skyport.gateway;

import com.skyport.proto.Empty;
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
 * Holds one gRPC server-stream open for the whole fleet and fans every frame out to all browsers
 * over Server-Sent Events. Reconnects automatically if the flight service restarts.
 */
@Component
public class TelemetryHub {
    private static final Logger log = LoggerFactory.getLogger(TelemetryHub.class);

    private final FlightServiceGrpc.FlightServiceStub async;
    private final Map<String, String> latest = new ConcurrentHashMap<>();
    private final List<SseEmitter> subscribers = new CopyOnWriteArrayList<>();
    private final ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();

    public TelemetryHub(FlightServiceGrpc.FlightServiceStub async) {
        this.async = async;
        executor.scheduleAtFixedRate(this::heartbeat, 20, 20, TimeUnit.SECONDS);
    }

    @EventListener(ApplicationReadyEvent.class)
    void start() {
        executor.execute(this::connect);
    }

    private void connect() {
        async.streamFleet(Empty.getDefaultInstance(), new StreamObserver<>() {
            @Override
            public void onNext(Telemetry t) {
                String json = Json.of(t);
                latest.put(t.getFlightNumber(), json);
                broadcast(json);
            }

            @Override
            public void onError(Throwable e) {
                log.warn("Fleet stream lost ({}), reconnecting in 3s", e.getMessage());
                reconnect();
            }

            @Override
            public void onCompleted() {
                reconnect();
            }

            private void reconnect() {
                executor.schedule(TelemetryHub.this::connect, 3, TimeUnit.SECONDS);
            }
        });
        log.info("Streaming live fleet telemetry over gRPC");
    }

    private void broadcast(String json) {
        for (SseEmitter emitter : subscribers) {
            try {
                emitter.send(json);
            } catch (Exception e) {
                subscribers.remove(emitter);
            }
        }
    }

    private void heartbeat() {
        for (SseEmitter emitter : subscribers) {
            try {
                emitter.send(SseEmitter.event().comment("keep-alive"));
            } catch (Exception e) {
                subscribers.remove(emitter);
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
            try {
                emitter.send(json);
            } catch (Exception ignored) {
                // emitter already closed
            }
        }
        return emitter;
    }

    public Collection<String> snapshot() {
        return latest.values();
    }
}
