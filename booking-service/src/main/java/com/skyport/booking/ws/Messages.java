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
    @XmlType(name = "", propOrder = {"flightNumber", "passengerName", "email", "seatClass", "basePrice"})
    public static class BookTicketRequest {
        public String flightNumber;
        public String passengerName;
        public String email;
        public String seatClass;
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
}
