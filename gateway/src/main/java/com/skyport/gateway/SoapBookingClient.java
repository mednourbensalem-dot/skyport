package com.skyport.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.IOException;
import java.io.StringReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/** Talks to the booking service with hand-built SOAP 1.1 envelopes, so every byte on the wire is visible. */
@Component
public class SoapBookingClient {
    private static final String SOAP = "http://schemas.xmlsoap.org/soap/envelope/";
    private static final String NS = "http://skyport.com/booking";

    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3)).build();
    private final String url;

    public SoapBookingClient(@Value("${booking.soap.url}") String url) {
        this.url = url;
    }

    /** Books a seat. Pass an empty seat to let the booking service pick the first free one. */
    public Map<String, Object> book(String flight, String name, String email, String seatClass,
                                    double basePrice, String seat) {
        Element response = call("<bk:BookTicketRequest>"
                + tag("flightNumber", flight)
                + tag("passengerName", name)
                + tag("email", email)
                + tag("seatClass", seatClass)
                + tag("seat", seat)
                + "<bk:basePrice>" + basePrice + "</bk:basePrice>"
                + "</bk:BookTicketRequest>");
        return booking(response);
    }

    public Map<String, Object> get(String reference) {
        return booking(call("<bk:GetBookingRequest>" + tag("reference", reference) + "</bk:GetBookingRequest>"));
    }

    public Map<String, Object> cancel(String reference) {
        return booking(call("<bk:CancelBookingRequest>" + tag("reference", reference) + "</bk:CancelBookingRequest>"));
    }

    /** Every ticket held by one email address, newest first. */
    public List<Map<String, Object>> list(String email) {
        Element response = call("<bk:ListBookingsRequest>" + tag("email", email) + "</bk:ListBookingsRequest>");
        List<Map<String, Object>> bookings = new ArrayList<>();
        for (Element element : children(response, "booking")) bookings.add(bookingMap(element));
        return bookings;
    }

    /** Checks in, optionally on a different free seat in the same cabin. */
    public Map<String, Object> checkIn(String reference, String seat) {
        return booking(call("<bk:CheckInRequest>"
                + tag("reference", reference)
                + tag("seat", seat)
                + "</bk:CheckInRequest>"));
    }

    public Map<String, Object> seatMap(String flight, String seatClass) {
        Element response = call("<bk:SeatMapRequest>"
                + tag("flightNumber", flight)
                + tag("seatClass", seatClass)
                + "</bk:SeatMapRequest>");
        List<Map<String, Object>> seats = new ArrayList<>();
        for (Element element : children(response, "seat")) {
            Map<String, Object> seat = new LinkedHashMap<>();
            seat.put("number", text(element, "number"));
            seat.put("taken", Boolean.parseBoolean(text(element, "taken")));
            seat.put("extra", parseDouble(text(element, "extra")));
            seat.put("window", Boolean.parseBoolean(text(element, "window")));
            seats.add(seat);
        }
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("flightNumber", text(response, "flightNumber"));
        out.put("seatClass", text(response, "seatClass"));
        out.put("seats", seats);
        return out;
    }

    public Map<String, Object> quote(double basePrice, String seatClass, int passengers, String seat) {
        Element response = call("<bk:QuoteTicketRequest>"
                + "<bk:basePrice>" + basePrice + "</bk:basePrice>"
                + tag("seatClass", seatClass)
                + "<bk:passengers>" + passengers + "</bk:passengers>"
                + tag("seat", seat)
                + "</bk:QuoteTicketRequest>");
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("baseFare", parseDouble(text(response, "baseFare")));
        out.put("taxes", parseDouble(text(response, "taxes")));
        out.put("fees", parseDouble(text(response, "fees")));
        out.put("total", parseDouble(text(response, "total")));
        out.put("currency", text(response, "currency"));
        return out;
    }

    public Map<String, Object> stats() {
        Element response = call("<bk:GetStatsRequest/>");
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("totalBookings", parseInt(text(response, "totalBookings")));
        out.put("confirmed", parseInt(text(response, "confirmed")));
        out.put("checkedIn", parseInt(text(response, "checkedIn")));
        out.put("cancelled", parseInt(text(response, "cancelled")));
        out.put("revenue", parseDouble(text(response, "revenue")));
        return out;
    }

    private Map<String, Object> booking(Element response) {
        Element element = child(response, "booking");
        if (element == null) throw new SoapFaultException("Booking service sent an unreadable reply.", 502);
        return bookingMap(element);
    }

    private Map<String, Object> bookingMap(Element booking) {
        Map<String, Object> out = new LinkedHashMap<>();
        for (Node n = booking.getFirstChild(); n != null; n = n.getNextSibling()) {
            if (n instanceof Element e) {
                String name = e.getLocalName();
                String value = e.getTextContent().trim();
                out.put(name, "price".equals(name) ? (Object) parseDouble(value) : value);
            }
        }
        return out;
    }

    private Element call(String body) {
        String envelope = "<soapenv:Envelope xmlns:soapenv=\"" + SOAP + "\" xmlns:bk=\"" + NS + "\">"
                + "<soapenv:Body>" + body + "</soapenv:Body></soapenv:Envelope>";
        try {
            HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                    .timeout(Duration.ofSeconds(5))
                    .header("Content-Type", "text/xml; charset=utf-8")
                    .header("SOAPAction", "\"\"")
                    .POST(HttpRequest.BodyPublishers.ofString(envelope))
                    .build();
            HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
            Document doc = parseXml(response.body());

            if (doc.getElementsByTagNameNS(SOAP, "Fault").getLength() > 0) {
                NodeList faults = doc.getElementsByTagName("faultstring");
                String message = faults.getLength() > 0
                        ? faults.item(0).getTextContent().trim() : "Booking rejected.";
                throw new SoapFaultException(message, faultStatus(message));
            }

            Element soapBody = (Element) doc.getElementsByTagNameNS(SOAP, "Body").item(0);
            Element payload = firstElementChild(soapBody);
            if (payload == null) throw new SoapFaultException("Booking service sent an empty reply.", 502);
            return payload;
        } catch (SoapFaultException e) {
            throw e;
        } catch (IOException e) {
            throw new SoapFaultException("Booking service is unavailable. Try again in a moment.", 503);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new SoapFaultException("Booking request was interrupted.", 503);
        } catch (Exception e) {
            throw new SoapFaultException("Booking service sent an unreadable reply.", 502);
        }
    }

    private static Document parseXml(String xml) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        factory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
        factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        factory.setExpandEntityReferences(false);
        return factory.newDocumentBuilder().parse(new InputSource(new StringReader(xml)));
    }

    private static int faultStatus(String message) {
        String m = message.toLowerCase(Locale.ROOT);
        if (m.contains("not found")) return 404;
        if (m.contains("taken") || m.contains("already") || m.contains("no seats")) return 409;
        return 400;
    }

    private static Element firstElementChild(Element parent) {
        if (parent == null) return null;
        for (Node n = parent.getFirstChild(); n != null; n = n.getNextSibling()) {
            if (n instanceof Element e) return e;
        }
        return null;
    }

    private static List<Element> children(Element parent, String name) {
        List<Element> out = new ArrayList<>();
        if (parent == null) return out;
        for (Node n = parent.getFirstChild(); n != null; n = n.getNextSibling()) {
            if (n instanceof Element e && name.equals(e.getLocalName())) out.add(e);
        }
        return out;
    }

    private static Element child(Element parent, String name) {
        List<Element> matches = children(parent, name);
        return matches.isEmpty() ? null : matches.get(0);
    }

    private static String text(Element parent, String name) {
        Element element = child(parent, name);
        return element == null ? "" : element.getTextContent().trim();
    }

    private static double parseDouble(String value) {
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private static int parseInt(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private static String tag(String name, String value) {
        return "<bk:" + name + ">" + esc(value == null ? "" : value) + "</bk:" + name + ">";
    }

    private static String esc(String s) {
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
