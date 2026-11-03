package com.skyport.flight;

import com.skyport.proto.Empty;
import com.skyport.proto.Flight;
import com.skyport.proto.FlightList;
import com.skyport.proto.FlightRequest;
import com.skyport.proto.FlightServiceGrpc;
import com.skyport.proto.Telemetry;
import io.grpc.Status;
import io.grpc.stub.ServerCallStreamObserver;
import io.grpc.stub.StreamObserver;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

/**
 * Simulated fleet. Every flight "flies" its route in a 5 minute loop so the demo always has live movement.
 */
@Component
public class FlightGrpcService extends FlightServiceGrpc.FlightServiceImplBase {

    private static final long CYCLE_MS = 300_000;

    private record Spec(Flight flight, long offsetMs) {}

    // Tunis–Carthage hub flying to Mediterranean destinations (real airport coordinates)
    private final List<Spec> fleet = List.of(
            spec("SP101", "TUN", "Tunis", 36.851, 10.227, "CDG", "Paris",       49.0097,   2.5479, 155, 150, "Airbus A320", 0.35),
            spec("SP202", "TUN", "Tunis", 36.851, 10.227, "FCO", "Rome",        41.8003,  12.2389, 110, 105, "Airbus A320", 0.10),
            spec("SP303", "TUN", "Tunis", 36.851, 10.227, "MXP", "Milan",       45.6306,   8.7281, 120, 125, "Airbus A319", 0.62),
            spec("SP404", "TUN", "Tunis", 36.851, 10.227, "FRA", "Frankfurt",  50.0379,   8.5622, 140, 165, "Airbus A320", 0.80),
            spec("SP505", "TUN", "Tunis", 36.851, 10.227, "CAI", "Cairo",       30.1219,  31.4056, 160, 190, "Boeing 737",  0.50),
            spec("SP606", "TUN", "Tunis", 36.851, 10.227, "IST", "Istanbul",    41.2753,  28.7519, 170, 205, "Boeing 737",  0.20),
            spec("SP707", "TUN", "Tunis", 36.851, 10.227, "ALG", "Algiers",    36.6911,   3.2154,  95,  85, "Airbus A320", 0.45),
            spec("SP808", "TUN", "Tunis", 36.851, 10.227, "CMN", "Casablanca", 33.3675,  -7.5898, 135, 165, "Airbus A320", 0.30),
            spec("SP909", "TUN", "Tunis", 36.851, 10.227, "MLA", "Malta",       35.9185,  14.4880,  80,  70, "Airbus A320", 0.70));

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(4);

    private static Spec spec(String no, String o, String oc, double olat, double olon,
                             String d, String dc, double dlat, double dlon,
                             double price, int minutes, String aircraft, double phase) {
        Flight f = Flight.newBuilder().setFlightNumber(no).setAirline("SkyPort Air")
                .setOrigin(o).setOriginCity(oc).setOriginLat(olat).setOriginLon(olon)
                .setDestination(d).setDestinationCity(dc).setDestLat(dlat).setDestLon(dlon)
                .setBasePrice(price).setDurationMinutes(minutes).setAircraft(aircraft).build();
        return new Spec(f, (long) (phase * CYCLE_MS));
    }

    private Spec find(String no) {
        return fleet.stream().filter(s -> s.flight().getFlightNumber().equalsIgnoreCase(no)).findFirst().orElse(null);
    }

    @Override
    public void listFlights(Empty request, StreamObserver<FlightList> out) {
        FlightList.Builder b = FlightList.newBuilder();
        fleet.forEach(s -> b.addFlights(s.flight()));
        out.onNext(b.build());
        out.onCompleted();
    }

    @Override
    public void getFlight(FlightRequest request, StreamObserver<Flight> out) {
        Spec s = find(request.getFlightNumber());
        if (s == null) {
            out.onError(Status.NOT_FOUND.withDescription("Unknown flight " + request.getFlightNumber()).asRuntimeException());
            return;
        }
        out.onNext(s.flight());
        out.onCompleted();
    }

    @Override
    public void streamTelemetry(FlightRequest request, StreamObserver<Telemetry> out) {
        Spec s = find(request.getFlightNumber());
        if (s == null) {
            out.onError(Status.NOT_FOUND.withDescription("Unknown flight " + request.getFlightNumber()).asRuntimeException());
            return;
        }
        ServerCallStreamObserver<Telemetry> call = (ServerCallStreamObserver<Telemetry>) out;
        ScheduledFuture<?>[] task = new ScheduledFuture<?>[1];
        call.setOnCancelHandler(() -> { if (task[0] != null) task[0].cancel(false); });
        task[0] = scheduler.scheduleAtFixedRate(() -> {
            try {
                if (call.isCancelled()) { task[0].cancel(false); return; }
                synchronized (call) { call.onNext(snapshot(s)); }
            } catch (Exception e) {
                if (task[0] != null) task[0].cancel(false);
            }
        }, 200, 1000, TimeUnit.MILLISECONDS);
    }

    private Telemetry snapshot(Spec s) {
        Flight f = s.flight();
        double p = ((System.currentTimeMillis() + s.offsetMs()) % CYCLE_MS) / (double) CYCLE_MS;
        double lat = f.getOriginLat() + (f.getDestLat() - f.getOriginLat()) * p;
        double lon = f.getOriginLon() + (f.getDestLon() - f.getOriginLon()) * p;
        String phase;
        int alt;
        int speed;
        if (p < 0.08) {
            phase = "Climbing"; double k = p / 0.08; alt = (int) (36000 * k); speed = (int) (160 + 300 * k);
        } else if (p > 0.92) {
            phase = "Descending"; double k = (1 - p) / 0.08; alt = (int) (36000 * k); speed = (int) (160 + 300 * k);
        } else {
            phase = "Cruising"; alt = 36000; speed = 470 + (int) (8 * Math.sin(p * 40));
        }
        return Telemetry.newBuilder().setFlightNumber(f.getFlightNumber())
                .setLatitude(lat).setLongitude(lon)
                .setAltitudeFt(alt / 100 * 100).setSpeedKts(speed)
                .setHeadingDeg(bearing(f.getOriginLat(), f.getOriginLon(), f.getDestLat(), f.getDestLon()))
                .setProgress(p).setPhase(phase)
                .setEtaMinutes((int) Math.round(f.getDurationMinutes() * (1 - p))).build();
    }

    private static int bearing(double lat1, double lon1, double lat2, double lon2) {
        double p1 = Math.toRadians(lat1), p2 = Math.toRadians(lat2), dl = Math.toRadians(lon2 - lon1);
        double y = Math.sin(dl) * Math.cos(p2);
        double x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
        return (int) ((Math.toDegrees(Math.atan2(y, x)) + 360) % 360);
    }
}
