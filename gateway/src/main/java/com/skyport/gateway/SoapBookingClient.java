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
import java.util.LinkedHashMap;
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

    public Map<String, Object> book(String flight, String name, String email, String seatClass, double basePrice) {
        return call("<bk:BookTicketRequest>"
                + "<bk:flightNumber>" + esc(flight) + "</bk:flightNumber>"
                + "<bk:passengerName>" + esc(name) + "</bk:passengerName>"
                + "<bk:email>" + esc(email) + "</bk:email>"
                + "<bk:seatClass>" + esc(seatClass) + "</bk:seatClass>"
                + "<bk:basePrice>" + basePrice + "</bk:basePrice>"
                + "</bk:BookTicketRequest>");
    }

    public Map<String, Object> get(String reference) {
        return call("<bk:GetBookingRequest><bk:reference>" + esc(reference) + "</bk:reference></bk:GetBookingRequest>");
    }

    public Map<String, Object> cancel(String reference) {
        return call("<bk:CancelBookingRequest><bk:reference>" + esc(reference) + "</bk:reference></bk:CancelBookingRequest>");
    }

    private Map<String, Object> call(String body) {
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
            return parse(response.body());
        } catch (IOException e) {
            throw new SoapFaultException("Booking service is unavailable. Try again in a moment.", 503);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new SoapFaultException("Booking request was interrupted.", 503);
        }
    }

    private Map<String, Object> parse(String xml) {
        try {
            DocumentBuilderFactory f = DocumentBuilderFactory.newInstance();
            f.setNamespaceAware(true);
            f.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            f.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            Document doc = f.newDocumentBuilder().parse(new InputSource(new StringReader(xml)));

            if (doc.getElementsByTagNameNS(SOAP, "Fault").getLength() > 0) {
                NodeList fs = doc.getElementsByTagName("faultstring");
                String msg = fs.getLength() > 0 ? fs.item(0).getTextContent().trim() : "Booking rejected.";
                throw new SoapFaultException(msg, msg.contains("not found") ? 404 : 400);
            }
            Element booking = (Element) doc.getElementsByTagNameNS(NS, "booking").item(0);
            Map<String, Object> out = new LinkedHashMap<>();
            for (Node n = booking.getFirstChild(); n != null; n = n.getNextSibling()) {
                if (n instanceof Element e) {
                    String value = e.getTextContent();
                    out.put(e.getLocalName(), "price".equals(e.getLocalName()) ? (Object) Double.parseDouble(value) : value);
                }
            }
            return out;
        } catch (SoapFaultException e) {
            throw e;
        } catch (Exception e) {
            throw new SoapFaultException("Booking service sent an unreadable reply.", 502);
        }
    }

    private static String esc(String s) {
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
