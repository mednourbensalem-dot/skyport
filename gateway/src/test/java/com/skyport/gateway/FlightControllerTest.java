package com.skyport.gateway;

import com.skyport.proto.FlightServiceGrpc;
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
    FlightServiceGrpc.FlightServiceBlockingStub flights;   // the FAKE gRPC catalog

    @Mock
    TelemetryHub hub;                                      // the FAKE telemetry source

    @InjectMocks
    FlightController controller;                           // the REAL controller, built with the fakes

    @Test
    void telemetry_wrapsHubSnapshotInJsonArray() {
        when(hub.snapshot()).thenReturn(List.of(
                "{\"flight\":\"SP101\"}",
                "{\"flight\":\"SP102\"}"));

        String result = controller.telemetry();

        assertEquals("[{\"flight\":\"SP101\"},{\"flight\":\"SP102\"}]", result);
        verify(hub).snapshot();
    }

    @Test
    void telemetry_returnsEmptyArray_whenHubHasNoData() {
        when(hub.snapshot()).thenReturn(List.of());

        assertEquals("[]", controller.telemetry());
    }
}
