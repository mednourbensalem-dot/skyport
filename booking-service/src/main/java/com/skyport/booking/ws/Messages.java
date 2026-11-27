package com.skyport.booking.ws;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlType;

/** JAXB request/response types. They mirror bookings.xsd one-to-one. */
public final class Messages {
    private Messages() {}

    @XmlRootElement(name = "BookTicketRequest")
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {"flightNumber", "passengerName", "email", "seatClass", "seat", "basePrice"})
    public static class BookTicketRequest {
        public String flightNumber;
        public String passengerName;
        public String email;
        public String seatClass;
        public String seat;
        public double basePrice;
    }

    @XmlRootElement(name = "BookTicketResponse")
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {"booking"})
    public static class BookTicketResponse {
        public BookingInfo booking;
    }

    @XmlRootElement(name = "GetBookingRequest")
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {"reference"})
    public static class GetBookingRequest {
        public String reference;
    }

    @XmlRootElement(name = "GetBookingResponse")
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {"booking"})
    public static class GetBookingResponse {
        public BookingInfo booking;
    }

    @XmlRootElement(name = "CancelBookingRequest")
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {"reference"})
    public static class CancelBookingRequest {
        public String reference;
    }

    @XmlRootElement(name = "CancelBookingResponse")
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {"booking"})
    public static class CancelBookingResponse {
        public BookingInfo booking;
    }

    @XmlRootElement(name = "ListBookingsRequest")
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {"email"})
    public static class ListBookingsRequest {
        public String email;
    }

    @XmlRootElement(name = "ListBookingsResponse")
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "ListBookingsResponse", propOrder = {"booking"})
    public static class ListBookingsResponse {
        public java.util.List<BookingInfo> booking;
    }

    @XmlRootElement(name = "CheckInRequest")
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {"reference", "seat"})
    public static class CheckInRequest {
        public String reference;
        public String seat;
    }

    @XmlRootElement(name = "CheckInResponse")
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {"booking"})
    public static class CheckInResponse {
        public BookingInfo booking;
    }

    @XmlRootElement(name = "SeatMapRequest")
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {"flightNumber", "seatClass"})
    public static class SeatMapRequest {
        public String flightNumber;
        public String seatClass;
    }

    @XmlRootElement(name = "SeatMapResponse")
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "SeatMapResponse", propOrder = {"flightNumber", "seatClass", "seat"})
    public static class SeatMapResponse {
        public String flightNumber;
        public String seatClass;
        public java.util.List<SeatInfo> seat;
    }

    @XmlRootElement(name = "QuoteTicketRequest")
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {"basePrice", "seatClass", "passengers", "seat"})
    public static class QuoteTicketRequest {
        public double basePrice;
        public String seatClass;
        public int passengers;
        public String seat;
    }

    @XmlRootElement(name = "QuoteTicketResponse")
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {"baseFare", "taxes", "fees", "total", "currency"})
    public static class QuoteTicketResponse {
        public double baseFare;
        public double taxes;
        public double fees;
        public double total;
        public String currency;
    }

    @XmlRootElement(name = "GetStatsRequest")
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "")
    public static class GetStatsRequest {
    }

    @XmlRootElement(name = "GetStatsResponse")
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {"totalBookings", "confirmed", "checkedIn", "cancelled", "revenue"})
    public static class GetStatsResponse {
        public int totalBookings;
        public int confirmed;
        public int checkedIn;
        public int cancelled;
        public double revenue;
    }
}
