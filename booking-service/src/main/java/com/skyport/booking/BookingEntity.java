package com.skyport.booking;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "bookings")
public class BookingEntity {
    @Id
    public String reference;
    public String flightNumber;
    public String passengerName;
    public String email;
    public String seatClass;
    public String seat;
    public double price;
    public String status;
    public Instant createdAt;
}
