package com.skyport.gateway;

import com.skyport.proto.FlightServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GrpcConfig {
    @Bean(destroyMethod = "shutdownNow")
    ManagedChannel flightChannel(@Value("${flight.grpc.host}") String host, @Value("${flight.grpc.port}") int port) {
        return ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
    }

    @Bean
    FlightServiceGrpc.FlightServiceBlockingStub flightBlocking(ManagedChannel channel) {
        return FlightServiceGrpc.newBlockingStub(channel);
    }

    @Bean
    FlightServiceGrpc.FlightServiceStub flightAsync(ManagedChannel channel) {
        return FlightServiceGrpc.newStub(channel);
    }
}
