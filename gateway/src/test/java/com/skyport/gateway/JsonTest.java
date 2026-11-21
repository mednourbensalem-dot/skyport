package com.skyport.gateway;

import com.google.protobuf.Struct;
import com.google.protobuf.Value;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class JsonTest {

    @Test
    void of_convertsProtobufMessageToCompactJson() {
        Struct message = Struct.newBuilder()
                .putFields("airline", Value.newBuilder().setStringValue("SkyPort").build())
                .build();

        String result = Json.of(message);

        assertEquals("{\"airline\":\"SkyPort\"}", result);
    }
}