package com.skyport.booking.ws;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "Seat", propOrder = {"number", "taken", "extra", "window"})
public class SeatInfo {
    public String number;
    public boolean taken;
    public double extra;
    public boolean window;
}
