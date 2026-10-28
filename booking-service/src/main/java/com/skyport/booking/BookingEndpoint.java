package com.skyport.booking;

import com.skyport.booking.ws.BookingInfo;
import com.skyport.booking.ws.Messages.*;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.security.SecureRandom;
import java.time.Instant;

import static com.skyport.booking.WebServiceConfig.NS;

@Endpoint
public class BookingEndpoint {
    private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private final SecureRandom random = new SecureRandom();
    private final BookingRepository repo;

    public BookingEndpoint(BookingRepository repo) {
        this.repo = repo;
    }

    @PayloadRoot(namespace = NS, localPart = "BookTicketRequest")
    @ResponsePayload
    public BookTicketResponse book(@RequestPayload BookTicketRequest req) {
        if (blank(req.flightNumber) || blank(req.passengerName) || blank(req.email))
            throw new BookingException("Flight, passenger name and email are required.");
        if (!req.email.contains("@")) throw new BookingException("Email address is not valid.");
        if (req.basePrice <= 0) throw new BookingException("Base price must be positive.");

        String cls = req.seatClass == null ? "" : req.seatClass.trim().toUpperCase();
        double multiplier = switch (cls) {
            case "ECONOMY" -> 1.0;
            case "BUSINESS" -> 2.4;
            case "FIRST" -> 4.0;
            default -> throw new BookingException("Unknown seat class: " + req.seatClass);
        };

        BookingEntity e = new BookingEntity();
        e.reference = "SP-" + randomChars(6);
        e.flightNumber = req.flightNumber.trim().toUpperCase();
        e.passengerName = req.passengerName.trim();
        e.email = req.email.trim();
        e.seatClass = cls;
        e.seat = seatFor(cls);
        e.price = Math.round(req.basePrice * multiplier * 100) / 100.0;
        e.status = "CONFIRMED";
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
        if ("CANCELLED".equals(e.status)) throw new BookingException("Booking " + e.reference + " is already cancelled.");
        e.status = "CANCELLED";
        repo.save(e);
        CancelBookingResponse res = new CancelBookingResponse();
        res.booking = toInfo(e);
        return res;
    }

    private BookingEntity find(String ref) {
        if (blank(ref)) throw new BookingException("Booking reference is required.");
        return repo.findById(ref.trim().toUpperCase())
                .orElseThrow(() -> new BookingException("Booking " + ref + " not found."));
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
        b.createdAt = e.createdAt.toString();
        return b;
    }

    private String seatFor(String cls) {
        int row = switch (cls) {
            case "FIRST" -> 1 + random.nextInt(3);
            case "BUSINESS" -> 4 + random.nextInt(7);
            default -> 11 + random.nextInt(28);
        };
        return row + String.valueOf("ABCDEF".charAt(random.nextInt(6)));
    }

    private String randomChars(int n) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
        return sb.toString();
    }

    private static boolean blank(String s) {
        return s == null || s.isBlank();
    }
}
