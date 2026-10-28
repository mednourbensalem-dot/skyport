package com.skyport.flight;

import io.grpc.Server;
import io.grpc.ServerBuilder;
import io.grpc.protobuf.services.ProtoReflectionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FlightServiceApplication {
    private static final Logger log = LoggerFactory.getLogger(FlightServiceApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(FlightServiceApplication.class, args);
    }

    /** Starts the gRPC server and keeps the JVM alive. Reflection is enabled so grpcurl works without .proto files. */
    @Bean
    CommandLineRunner grpcServer(FlightGrpcService service, @Value("${grpc.port}") int port) {
        return args -> {
            Server server = ServerBuilder.forPort(port)
                    .addService(service)
                    .addService(ProtoReflectionService.newInstance())
                    .build()
                    .start();
            log.info("SkyPort gRPC flight service listening on port {}", port);
            Runtime.getRuntime().addShutdownHook(new Thread(server::shutdown));
            server.awaitTermination();
        };
    }
}
