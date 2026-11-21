package com.skyport.gateway;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FlightControllerTest {

    @Mock
    TelemetryHub hub;                 // the FAKE dependency

    @InjectMocks
    FlightController controller;      // the REAL controller, built with the fake hub

    @Test
    void telemetry_wrapsHubSnapshotInJsonArray() {
        // ARRANGE: tell the fake hub what to return
        when(hub.snapshot()).thenReturn(List.of(
                "{\"flight\":\"SP101\"}",
                "{\"flight\":\"SP102\"}"));

        // ACT: call the real method
        String result = controller.telemetry();

        // ASSERT: check the result, and that the hub was really used
        assertEquals("[{\"flight\":\"SP101\"},{\"flight\":\"SP102\"}]", result);
        verify(hub).snapshot();
    }

    @Test
    void telemetry_returnsEmptyArray_whenHubHasNoData() {
        when(hub.snapshot()).thenReturn(List.of());

        assertEquals("[]", controller.telemetry());
    }
}