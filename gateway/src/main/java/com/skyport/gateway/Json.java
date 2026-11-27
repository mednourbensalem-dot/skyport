package com.skyport.gateway;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.MessageOrBuilder;
import com.google.protobuf.util.JsonFormat;

import java.io.IOException;
import java.util.Map;

/** Converts protobuf messages to JSON so REST clients get the gRPC data as-is. */
final class Json {
    private static final JsonFormat.Printer PRINTER =
            JsonFormat.printer().includingDefaultValueFields().omittingInsignificantWhitespace();
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private Json() {}

    static String of(MessageOrBuilder message) {
        try {
            return PRINTER.print(message);
        } catch (InvalidProtocolBufferException e) {
            throw new IllegalStateException(e);
        }
    }

    static Map<String, Object> map(MessageOrBuilder message) {
        try {
            return MAPPER.readValue(of(message), new TypeReference<Map<String, Object>>() {});
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }
}
