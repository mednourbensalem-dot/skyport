package com.skyport.booking;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Cabin layouts for the demo fleet, plus the rules that turn a seat into a fee and a boarding group.
 * FIRST is a 2-2 cabin, BUSINESS and ECONOMY are 3-3.
 */
final class SeatLayout {
    private static final String[] FIRST_LETTERS = {"A", "C", "D", "F"};
    private static final String[] CABIN_LETTERS = {"A", "B", "C", "D", "E", "F"};

    private SeatLayout() {}

    static int firstRow(String seatClass) {
        return switch (seatClass) {
            case "FIRST" -> 1;
            case "BUSINESS" -> 4;
            case "ECONOMY" -> 11;
            default -> throw new BookingException("Unknown seat class: " + seatClass);
        };
    }

    static int lastRow(String seatClass) {
        return switch (seatClass) {
            case "FIRST" -> 3;
            case "BUSINESS" -> 10;
            case "ECONOMY" -> 38;
            default -> throw new BookingException("Unknown seat class: " + seatClass);
        };
    }

    static String[] letters(String seatClass) {
        return "FIRST".equals(seatClass) ? FIRST_LETTERS : CABIN_LETTERS;
    }

    static List<String> all(String seatClass) {
        List<String> seats = new ArrayList<>();
        for (int row = firstRow(seatClass); row <= lastRow(seatClass); row++) {
            for (String letter : letters(seatClass)) seats.add(row + letter);
        }
        return seats;
    }

    static boolean valid(String seatClass, String seat) {
        if (seat == null || seat.isBlank()) return false;
        String s = seat.trim().toUpperCase();
        int row = row(s);
        String letter = letter(s);
        return row >= firstRow(seatClass) && row <= lastRow(seatClass)
                && Arrays.asList(letters(seatClass)).contains(letter);
    }

    static int row(String seat) {
        try {
            return Integer.parseInt(seat.trim().replaceAll("[^0-9]", ""));
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    static String letter(String seat) {
        String s = seat.trim().toUpperCase();
        return s.isEmpty() ? "" : s.substring(s.length() - 1);
    }

    /** Seat fee added to the booking total. */
    static double extra(String seatClass, String seat) {
        if (seat == null || seat.isBlank()) return 0;
        String s = seat.trim().toUpperCase();
        if ("FIRST".equals(seatClass)) return 40;
        if ("BUSINESS".equals(seatClass)) return 18;
        int row = row(s);
        String letter = letter(s);
        double fee = 0;
        if (row <= 12) fee += 24;                                   // extra legroom rows
        if (letter.equals("A") || letter.equals("F")) fee += 12;    // window
        else if (letter.equals("C") || letter.equals("D")) fee += 6; // aisle
        return fee;
    }

    static String boardingGroup(String seatClass, String seat) {
        return switch (seatClass) {
            case "FIRST" -> "1";
            case "BUSINESS" -> "2";
            default -> row(seat) <= 20 ? "3" : "4";
        };
    }

    /**
     * Deterministic simulated occupancy so the seat map looks like a real cabin without a second database.
     * Real bookings are layered on top of these seats.
     */
    static boolean simulatedTaken(String flightNumber, String seat) {
        return Math.floorMod((flightNumber + ":" + seat).hashCode(), 100) < 34;
    }
}
