package com.skyport.flight;

import com.skyport.proto.Empty;
import com.skyport.proto.Flight;
import com.skyport.proto.FlightList;
import com.skyport.proto.FlightRequest;
import com.skyport.proto.FlightServiceGrpc;
import com.skyport.proto.SearchRequest;
import com.skyport.proto.Stats;
import com.skyport.proto.Telemetry;
import io.grpc.Status;
import io.grpc.stub.ServerCallStreamObserver;
import io.grpc.stub.StreamObserver;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

/**
 * Simulated fleet. Every flight "flies" its route in a 5 minute loop so the demo always has live movement.
 *
 * <p>Three ways to consume it: unary calls (catalog, search, aggregate stats) and two server streams
 * (one aircraft per request, or the whole fleet on a single stream).
 */
@Component
public class FlightGrpcService extends FlightServiceGrpc.FlightServiceImplBase {

    private static final long CYCLE_MS = 300_000;
    private static final int CRUISE_ALT_FT = 36_000;
    private static final double TAXI_FRACTION = 0.08;

    private record Spec(Flight flight, long offsetMs) {}

    // Tunis–Carthage hub flying to Mediterranean destinations (real airport coordinates)
    private final List<Spec> fleet = List.of(
            spec("SP101", "TUN", "Tunis", 36.851, 10.227, "CDG", "Paris",       49.0097,   2.5479, 155, 150, "Airbus A320", 0.35),
            spec("SP202", "TUN", "Tunis", 36.851, 10.227, "FCO", "Rome",        41.8003,  12.2389, 110, 105, "Airbus A320", 0.10),
            spec("SP303", "TUN", "Tunis", 36.851, 10.227, "MXP", "Milan",       45.6306,   8.7281, 120, 125, "Airbus A319", 0.62),
            spec("SP404", "TUN", "Tunis", 36.851, 10.227, "FRA", "Frankfurt",  50.0379,   8.5622, 140, 165, "Airbus A320", 0.80),
            spec("SP505", "TUN", "Tunis", 36.851, 10.227, "CAI", "Cairo",       30.1219,  31.4056, 160, 190, "Boeing 737",  0.50),
            spec("SP606", "TUN", "Tunis", 36.851, 10.227, "IST", "Istanbul",    41.2753,  28.7519, 170, 205, "Boeing 737",  0.20),
            spec("SP707", "TUN", "Tunis", 36.851, 10.227, "ALG", "Algiers",     36.6911,   3.2154,  95,  85, "Airbus A320", 0.45),
            spec("SP808", "TUN", "Tunis", 36.851, 10.227, "CMN", "Casablanca",  33.3675,  -7.5898, 135, 165, "Airbus A320", 0.30),
            spec("SP909", "TUN", "Tunis", 36.851, 10.227, "MLA", "Malta",       35.9185,  14.4880,  80,  70, "Airbus A320", 0.70));

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(4);
    private final Set<ServerCallStreamObserver<Telemetry>> watchers = ConcurrentHashMap.newKeySet();

    public FlightGrpcService() {
        // one frame per second for everyone watching the whole fleet
        scheduler.scheduleAtFixedRate(this::pushFleetFrame, 1, 1, TimeUnit.SECONDS);
    }

    @PreDestroy
    void shutdown() {
        scheduler.shutdownNow();
    }

    private static Spec spec(String no, String o, String oc, double olat, double olon,
                             String d, String dc, double dlat, double dlon,
                             double price, int minutes, String aircraft, double phase) {
        int hash = no.hashCode();
        int capacity = aircraft.contains("737") ? 189 : 174;
        int sold = 40 + Math.floorMod(hash, 90);
        Flight f = Flight.newBuilder().setFlightNumber(no).setAirline("SkyPort Air")
                .setOrigin(o).setOriginCity(oc).setOriginLat(olat).setOriginLon(olon)
                .setDestination(d).setDestinationCity(dc).setDestLat(dlat).setDestLon(dlon)
                .setBasePrice(price).setDurationMinutes(minutes).setAircraft(aircraft)
                .setGate("" + (char) ('A' + Math.floorMod(hash, 5)) + (1 + Math.floorMod(hash, 24)))
                .setSeatsAvailable(Math.max(0, capacity - sold))
                .setOnTimePercent(74 + Math.floorMod(hash * 7, 24))
                .setDistanceKm(Math.round(haversineKm(olat, olon, dlat, dlon)))
                .build();
        return new Spec(f, (long) (phase * CYCLE_MS));
    }

    private Spec find(String no) {
        if (no == null) return null;
        return fleet.stream().filter(s -> s.flight().getFlightNumber().equalsIgnoreCase(no.trim())).findFirst().orElse(null);
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
    public void searchFlights(SearchRequest request, StreamObserver<FlightList> out) {
        String origin = normalize(request.getOrigin());
        String destination = normalize(request.getDestination());
        FlightList.Builder b = FlightList.newBuilder();
        fleet.stream()
                .map(Spec::flight)
                .filter(f -> origin.isEmpty()
                        || normalize(f.getOrigin()).equals(origin) || normalize(f.getOriginCity()).contains(origin))
                .filter(f -> destination.isEmpty()
                        || normalize(f.getDestination()).equals(destination) || normalize(f.getDestinationCity()).contains(destination))
                .forEach(b::addFlights);
        out.onNext(b.build());
        out.onCompleted();
    }

    @Override
    public void fleetStats(Empty request, StreamObserver<Stats> out) {
        List<Telemetry> frames = fleet.stream().map(this::snapshot).toList();
        out.onNext(Stats.newBuilder()
                .setAirborne(frames.size())
                .setClimbing((int) frames.stream().filter(f -> "Climbing".equals(f.getPhase())).count())
                .setCruising((int) frames.stream().filter(f -> "Cruising".equals(f.getPhase())).count())
                .setDescending((int) frames.stream().filter(f -> "Descending".equals(f.getPhase())).count())
                .setAvgAltitudeFt(Math.round(frames.stream().mapToInt(Telemetry::getAltitudeFt).average().orElse(0)))
                .setAvgSpeedKts(Math.round(frames.stream().mapToInt(Telemetry::getSpeedKts).average().orElse(0)))
                .setSeatsAvailable(fleet.stream().mapToInt(s -> s.flight().getSeatsAvailable()).sum())
                .setAvgOnTimePercent(Math.round(fleet.stream().mapToInt(s -> s.flight().getOnTimePercent()).average().orElse(0)))
                .build());
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
        call.setOnCancelHandler(() -> {
            if (task[0] != null) task[0].cancel(false);
        });
        task[0] = scheduler.scheduleAtFixedRate(() -> {
            try {
                if (call.isCancelled()) {
                    task[0].cancel(false);
                    return;
                }
                synchronized (call) {
                    call.onNext(snapshot(s));
                }
            } catch (Exception e) {
                if (task[0] != null) task[0].cancel(false);
            }
        }, 200, 1000, TimeUnit.MILLISECONDS);
    }

    @Override
    public void streamFleet(Empty request, StreamObserver<Telemetry> out) {
        ServerCallStreamObserver<Telemetry> call = (ServerCallStreamObserver<Telemetry>) out;
        watchers.add(call);
        call.setOnCancelHandler(() -> watchers.remove(call));
        synchronized (call) {
            fleet.forEach(s -> call.onNext(snapshot(s)));
        }
    }

    private void pushFleetFrame() {
        if (watchers.isEmpty()) return;
        List<Telemetry> frames = fleet.stream().map(this::snapshot).toList();
        for (ServerCallStreamObserver<Telemetry> watcher : watchers) {
            if (watcher.isCancelled()) {
                watchers.remove(watcher);
                continue;
            }
            try {
                synchronized (watcher) {
                    for (Telemetry frame : frames) watcher.onNext(frame);
                }
            } catch (RuntimeException e) {
                watchers.remove(watcher);
            }
        }
    }

    private Telemetry snapshot(Spec s) {
        Flight f = s.flight();
        double p = ((System.currentTimeMillis() + s.offsetMs()) % CYCLE_MS) / (double) CYCLE_MS;
        double lat = f.getOriginLat() + (f.getDestLat() - f.getOriginLat()) * p;
        double lon = f.getOriginLon() + (f.getDestLon() - f.getOriginLon()) * p;

        String phase;
        int alt;
        int speed;
        int verticalSpeed;
        if (p < TAXI_FRACTION) {
            phase = "Climbing";
            double k = p / TAXI_FRACTION;
            alt = (int) (CRUISE_ALT_FT * k);
            speed = (int) (160 + 300 * k);
            verticalSpeed = 2400;
        } else if (p > 1 - TAXI_FRACTION) {
            phase = "Descending";
            double k = (1 - p) / TAXI_FRACTION;
            alt = (int) (CRUISE_ALT_FT * k);
            speed = (int) (160 + 300 * k);
            verticalSpeed = -1800;
        } else {
            phase = "Cruising";
            alt = CRUISE_ALT_FT;
            speed = 470 + (int) (8 * Math.sin(p * 40));
            verticalSpeed = (int) (120 * Math.sin(p * 60));
        }

        return Telemetry.newBuilder()
                .setFlightNumber(f.getFlightNumber())
                .setLatitude(lat).setLongitude(lon)
                .setAltitudeFt(alt / 100 * 100)
                .setSpeedKts(speed)
                .setHeadingDeg(bearing(f.getOriginLat(), f.getOriginLon(), f.getDestLat(), f.getDestLon()))
                .setProgress(p)
                .setPhase(phase)
                .setEtaMinutes((int) Math.round(f.getDurationMinutes() * (1 - p)))
                .setVerticalSpeedFpm(verticalSpeed)
                .setOutsideTempC((int) Math.round(15 - alt / 1000.0 * 2.0))
                .setWindKts(30 + (int) Math.round(18 * Math.sin(p * 26)))
                .setFuelPercent((int) Math.max(6, Math.round(96 - 88 * p)))
                .build();
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim().toUpperCase(Locale.ROOT);
    }

    private static int bearing(double lat1, double lon1, double lat2, double lon2) {
        double p1 = Math.toRadians(lat1), p2 = Math.toRadians(lat2), dl = Math.toRadians(lon2 - lon1);
        double y = Math.sin(dl) * Math.cos(p2);
        double x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
        return (int) ((Math.toDegrees(Math.atan2(y, x)) + 360) % 360);
    }

    private static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double r = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return r * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}
