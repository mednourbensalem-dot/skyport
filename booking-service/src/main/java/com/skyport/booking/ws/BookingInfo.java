package com.skyport.booking.ws;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "Booking", propOrder = {"reference", "flightNumber", "passengerName", "email",
        "seatClass", "seat", "price", "status", "createdAt"})
public class BookingInfo {
    public String reference;
    public String flightNumber;
    public String passengerName;
    public String email;
    public String seatClass;
    public String seat;
    public double price;
    public String status;
    public String createdAt;
}
