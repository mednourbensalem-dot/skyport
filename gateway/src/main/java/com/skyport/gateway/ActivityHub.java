package com.skyport.gateway;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.Instant;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.CopyOnWriteArrayList;

/** Small event bus: booking, check-in and cancellation events fan out over Server-Sent Events. */
@Component
public class ActivityHub {
    private static final int KEEP = 12;

    private final ObjectMapper json = new ObjectMapper();
    private final Deque<String> recent = new ConcurrentLinkedDeque<>();
    private final List<SseEmitter> subscribers = new CopyOnWriteArrayList<>();

    public void publish(String type, String reference, String flightNumber, String passenger) {
        try {
            String payload = json.writeValueAsString(Map.of(
                    "type", type,
                    "reference", reference,
                    "flightNumber", flightNumber,
                    "passenger", passenger,
                    "at", Instant.now().toString()));
            recent.addFirst(payload);
            while (recent.size() > KEEP) recent.removeLast();
            for (SseEmitter emitter : subscribers) {
                try {
                    emitter.send(payload);
                } catch (Exception e) {
                    subscribers.remove(emitter);
                }
            }
        } catch (JsonProcessingException ignored) {
            // an unrepresentable event is not worth failing a booking over
        }
    }

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(0L);
        subscribers.add(emitter);
        emitter.onCompletion(() -> subscribers.remove(emitter));
        emitter.onTimeout(() -> subscribers.remove(emitter));
        emitter.onError(t -> subscribers.remove(emitter));
        for (String payload : recent) {
            try {
                emitter.send(payload);
            } catch (Exception ignored) {
                // the emitter is already gone; the callbacks clean it up
            }
        }
        return emitter;
    }

    public List<String> recent() {
        return List.copyOf(recent);
    }
}
