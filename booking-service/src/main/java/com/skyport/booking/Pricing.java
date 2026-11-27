package com.skyport.booking;

/**
 * Single source of truth for fares. The gateway asks for a quote with the same rules it books with,
 * so the price shown in the browser is always the price stored in PostgreSQL.
 */
public final class Pricing {
    public static final String CURRENCY = "USD";
    private static final double TAX_RATE = 0.11;
    private static final double SERVICE_FEE = 28.0;

    /** Per-passenger components; total already multiplied by the passenger count. */
    public record Quote(double baseFare, double taxes, double fees, double total) {}

    private Pricing() {}

    public static double multiplier(String seatClass) {
        return switch (seatClass) {
            case "ECONOMY" -> 1.0;
            case "BUSINESS" -> 2.4;
            case "FIRST" -> 4.0;
            default -> throw new BookingException("Unknown seat class: " + seatClass);
        };
    }

    public static Quote quote(double basePrice, String seatClass, int passengers, String seat) {
        if (basePrice <= 0) throw new BookingException("Base price must be positive.");
        int pax = passengers < 1 ? 1 : passengers;
        double baseFare = round2(basePrice * multiplier(seatClass));
        double taxes = round2(baseFare * TAX_RATE);
        double fees = round2(SERVICE_FEE + SeatLayout.extra(seatClass, seat));
        double total = round2((baseFare + taxes + fees) * pax);
        return new Quote(baseFare, taxes, fees, total);
    }

    static double round2(double value) {
        return Math.round(value * 100) / 100.0;
    }
}
