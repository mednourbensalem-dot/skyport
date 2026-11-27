package com.skyport.gateway;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * Live activity feed. REST returns the last few events, SSE keeps the browser in sync.
 * Kept separate from telemetry so the two streams reconnect independently.
 */
@RestController
@RequestMapping("/api/events")
public class ActivityController {
    private final ActivityHub hub;

    public ActivityController(ActivityHub hub) {
        this.hub = hub;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public String recent() {
        return "[" + String.join(",", hub.recent()) + "]";
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream() {
        return hub.subscribe();
    }
}
