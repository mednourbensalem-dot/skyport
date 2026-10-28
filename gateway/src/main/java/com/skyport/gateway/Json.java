package com.skyport.gateway;

import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.MessageOrBuilder;
import com.google.protobuf.util.JsonFormat;

/** Converts protobuf messages to JSON so REST clients get the gRPC data as-is. */
final class Json {
    private static final JsonFormat.Printer PRINTER =
            JsonFormat.printer().includingDefaultValueFields().omittingInsignificantWhitespace();

    private Json() {}

    static String of(MessageOrBuilder message) {
        try {
            return PRINTER.print(message);
        } catch (InvalidProtocolBufferException e) {
            throw new IllegalStateException(e);
        }
    }
}
