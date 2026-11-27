package com.skyport.booking;

import com.skyport.booking.ws.BookingInfo;
import com.skyport.booking.ws.Messages.*;
import com.skyport.booking.ws.SeatInfo;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import static com.skyport.booking.WebServiceConfig.NS;

@Endpoint
public class BookingEndpoint {
    private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final String CONFIRMED = "CONFIRMED";
    private static final String CHECKED_IN = "CHECKED_IN";
    private static final String CANCELLED = "CANCELLED";

    private final SecureRandom random = new SecureRandom();
    private final BookingRepository repo;

    public BookingEndpoint(BookingRepository repo) {
        this.repo = repo;
    }

    @PayloadRoot(namespace = NS, localPart = "BookTicketRequest")
    @ResponsePayload
    public BookTicketResponse book(@RequestPayload BookTicketRequest req) {
        if (blank(req.flightNumber) || blank(req.passengerName) || blank(req.email)) {
            throw new BookingException("Flight, passenger name and email are required.");
        }
        if (!req.email.contains("@") || !req.email.contains(".")) {
            throw new BookingException("Email address is not valid.");
        }
        if (req.basePrice <= 0) throw new BookingException("Base price must be positive.");

        String flightNumber = req.flightNumber.trim().toUpperCase(Locale.ROOT);
        String seatClass = normalizeClass(req.seatClass);
        String requested = req.seat == null ? "" : req.seat.trim().toUpperCase(Locale.ROOT);

        String seat;
        if (requested.isEmpty()) {
            seat = firstFreeSeat(flightNumber, seatClass);
        } else {
            if (!SeatLayout.valid(seatClass, requested)) {
                throw new BookingException("Seat " + requested + " is not in the " + seatClass + " cabin.");
            }
            if (seatTaken(flightNumber, seatClass, requested)) {
                throw new BookingException("Seat " + requested + " was just taken. Pick another seat.");
            }
            seat = requested;
        }

        BookingEntity e = new BookingEntity();
        e.reference = "SP-" + randomChars(6);
        e.flightNumber = flightNumber;
        e.passengerName = req.passengerName.trim();
        e.email = req.email.trim();
        e.seatClass = seatClass;
        e.seat = seat;
        e.price = Pricing.quote(req.basePrice, seatClass, 1, seat).total();
        e.status = CONFIRMED;
        e.boardingGroup = SeatLayout.boardingGroup(seatClass, seat);
        e.createdAt = Instant.now();
        repo.save(e);

        BookTicketResponse res = new BookTicketResponse();
        res.booking = toInfo(e);
        return res;
    }

    @PayloadRoot(namespace = NS, localPart = "GetBookingRequest")
    @ResponsePayload
    public GetBookingResponse get(@RequestPayload GetBookingRequest req) {
        GetBookingResponse res = new GetBookingResponse();
        res.booking = toInfo(find(req.reference));
        return res;
    }

    @PayloadRoot(namespace = NS, localPart = "CancelBookingRequest")
    @ResponsePayload
    public CancelBookingResponse cancel(@RequestPayload CancelBookingRequest req) {
        BookingEntity e = find(req.reference);
        if (CANCELLED.equals(e.status)) throw new BookingException("Booking " + e.reference + " is already cancelled.");
        e.status = CANCELLED;
        repo.save(e);
        CancelBookingResponse res = new CancelBookingResponse();
        res.booking = toInfo(e);
        return res;
    }

    @PayloadRoot(namespace = NS, localPart = "ListBookingsRequest")
    @ResponsePayload
    public ListBookingsResponse list(@RequestPayload ListBookingsRequest req) {
        if (blank(req.email) || !req.email.contains("@")) {
            throw new BookingException("A valid email address is required.");
        }
        ListBookingsResponse res = new ListBookingsResponse();
        res.booking = new ArrayList<>(repo.findByEmailIgnoreCaseOrderByCreatedAtDesc(req.email.trim())
                .stream().map(this::toInfo).toList());
        return res;
    }

    @PayloadRoot(namespace = NS, localPart = "CheckInRequest")
    @ResponsePayload
    public CheckInResponse checkIn(@RequestPayload CheckInRequest req) {
        BookingEntity e = find(req.reference);
        if (CANCELLED.equals(e.status)) throw new BookingException("Booking " + e.reference + " is cancelled.");
        if (CHECKED_IN.equals(e.status)) throw new BookingException("Passenger " + e.passengerName + " is already checked in.");

        String requested = req.seat == null ? "" : req.seat.trim().toUpperCase(Locale.ROOT);
        if (!requested.isEmpty()) {
            if (!SeatLayout.valid(e.seatClass, requested)) {
                throw new BookingException("Seat " + requested + " is not in the " + e.seatClass + " cabin.");
            }
            if (!requested.equalsIgnoreCase(e.seat) && seatTaken(e.flightNumber, e.seatClass, requested)) {
                throw new BookingException("Seat " + requested + " is taken. Pick another seat.");
            }
            e.seat = requested;
        }
        e.status = CHECKED_IN;
        e.boardingGroup = SeatLayout.boardingGroup(e.seatClass, e.seat);
        e.checkedInAt = Instant.now();
        repo.save(e);

        CheckInResponse res = new CheckInResponse();
        res.booking = toInfo(e);
        return res;
    }

    @PayloadRoot(namespace = NS, localPart = "SeatMapRequest")
    @ResponsePayload
    public SeatMapResponse seatMap(@RequestPayload SeatMapRequest req) {
        if (blank(req.flightNumber)) throw new BookingException("Flight number is required.");
        String flightNumber = req.flightNumber.trim().toUpperCase(Locale.ROOT);
        String seatClass = normalizeClass(req.seatClass);

        Set<String> occupied = repo
                .findByFlightNumberAndSeatClassAndStatusNot(flightNumber, seatClass, CANCELLED)
                .stream()
                .map(b -> b.seat == null ? "" : b.seat.toUpperCase(Locale.ROOT))
                .collect(Collectors.toSet());

        SeatMapResponse res = new SeatMapResponse();
        res.flightNumber = flightNumber;
        res.seatClass = seatClass;
        res.seat = new ArrayList<>();
        for (String number : SeatLayout.all(seatClass)) {
            SeatInfo seat = new SeatInfo();
            seat.number = number;
            seat.taken = occupied.contains(number) || SeatLayout.simulatedTaken(flightNumber, number);
            seat.extra = SeatLayout.extra(seatClass, number);
            seat.window = number.endsWith("A") || number.endsWith("F");
            res.seat.add(seat);
        }
        return res;
    }

    @PayloadRoot(namespace = NS, localPart = "QuoteTicketRequest")
    @ResponsePayload
    public QuoteTicketResponse quote(@RequestPayload QuoteTicketRequest req) {
        String seatClass = normalizeClass(req.seatClass);
        Pricing.Quote quote = Pricing.quote(req.basePrice, seatClass, req.passengers, req.seat);

        QuoteTicketResponse res = new QuoteTicketResponse();
        res.baseFare = quote.baseFare();
        res.taxes = quote.taxes();
        res.fees = quote.fees();
        res.total = quote.total();
        res.currency = Pricing.CURRENCY;
        return res;
    }

    @PayloadRoot(namespace = NS, localPart = "GetStatsRequest")
    @ResponsePayload
    public GetStatsResponse stats(@RequestPayload GetStatsRequest req) {
        GetStatsResponse res = new GetStatsResponse();
        res.totalBookings = (int) repo.count();
        res.confirmed = (int) repo.countByStatus(CONFIRMED);
        res.checkedIn = (int) repo.countByStatus(CHECKED_IN);
        res.cancelled = (int) repo.countByStatus(CANCELLED);
        res.revenue = Pricing.round2(repo.revenueExcludingCancelled());
        return res;
    }

    private BookingEntity find(String ref) {
        if (blank(ref)) throw new BookingException("Booking reference is required.");
        return repo.findById(ref.trim().toUpperCase(Locale.ROOT))
                .orElseThrow(() -> new BookingException("Booking " + ref + " not found."));
    }

    private String firstFreeSeat(String flightNumber, String seatClass) {
        return SeatLayout.all(seatClass).stream()
                .filter(seat -> !seatTaken(flightNumber, seatClass, seat))
                .findFirst()
                .orElseThrow(() -> new BookingException("No seats left in " + seatClass + " on " + flightNumber + "."));
    }

    private boolean seatTaken(String flightNumber, String seatClass, String seat) {
        if (SeatLayout.simulatedTaken(flightNumber, seat)) return true;
        return repo.findByFlightNumberAndSeatClassAndStatusNot(flightNumber, seatClass, CANCELLED)
                .stream()
                .anyMatch(b -> seat.equalsIgnoreCase(b.seat));
    }

    private BookingInfo toInfo(BookingEntity e) {
        BookingInfo b = new BookingInfo();
        b.reference = e.reference;
        b.flightNumber = e.flightNumber;
        b.passengerName = e.passengerName;
        b.email = e.email;
        b.seatClass = e.seatClass;
        b.seat = e.seat;
        b.price = e.price;
        b.status = e.status;
        b.boardingGroup = e.boardingGroup == null
                ? SeatLayout.boardingGroup(e.seatClass, e.seat) : e.boardingGroup;
        b.checkedInAt = e.checkedInAt == null ? "" : e.checkedInAt.toString();
        b.createdAt = e.createdAt == null ? "" : e.createdAt.toString();
        return b;
    }

    private String randomChars(int n) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
        return sb.toString();
    }

    private static String normalizeClass(String seatClass) {
        if (seatClass == null || seatClass.isBlank()) return "ECONOMY";
        return seatClass.trim().toUpperCase(Locale.ROOT);
    }

    private static boolean blank(String s) {
        return s == null || s.isBlank();
    }
}
