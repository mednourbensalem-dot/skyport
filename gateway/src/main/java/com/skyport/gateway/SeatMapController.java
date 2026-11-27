package com.skyport.gateway;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Locale;
import java.util.Map;

/** REST wrapper around the SOAP seat inventory. */
@RestController
@RequestMapping("/api/seats")
public class SeatMapController {
    private final SoapBookingClient soap;

    public SeatMapController(SoapBookingClient soap) {
        this.soap = soap;
    }

    @GetMapping
    public Map<String, Object> seats(@RequestParam String flightNumber,
                                     @RequestParam(defaultValue = "ECONOMY") String seatClass) {
        if (flightNumber == null || flightNumber.isBlank()) {
            throw new IllegalArgumentException("Flight number is required.");
        }
        return soap.seatMap(flightNumber.trim().toUpperCase(Locale.ROOT),
                seatClass.trim().toUpperCase(Locale.ROOT));
    }
}
