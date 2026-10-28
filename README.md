# SkyPort

A live flight-operations platform that uses **REST**, **SOAP** and **gRPC** together, all running in Docker.

```
Browser --REST/SSE--> gateway (8080) --gRPC--> flight-service (9090)
                          |
                          +-----SOAP--> booking-service (8081) --JDBC--> PostgreSQL
```

| Service | Tech | What it does |
|---|---|---|
| `flight-service` | Java 21, gRPC (server streaming) | Simulated fleet, flight catalog, live telemetry every second |
| `booking-service` | Java 21, Spring-WS (SOAP), JPA | Books, reads and cancels tickets, stores them in PostgreSQL |
| `gateway` | Java 21, Spring Boot (REST, SSE) | Serves the web UI and the REST API, calls the other two |
| `postgres` | PostgreSQL 16 | Ticket storage (Docker volume `pgdata`) |

## Run it

Requires Docker Desktop. From this folder:

```
docker compose up --build
```

The first build downloads Maven dependencies and takes a few minutes. Then open **http://localhost:8080**.

Stop with `Ctrl + C`. Run `docker compose down` to remove containers (add `-v` to also delete tickets).

## Try each protocol

**REST (gateway)**
```
curl http://localhost:8080/api/flights
curl http://localhost:8080/api/flights/SP101
curl http://localhost:8080/api/telemetry
curl -X POST http://localhost:8080/api/bookings -H "Content-Type: application/json" ^
  -d "{\"flightNumber\":\"SP101\",\"passengerName\":\"Med Nour\",\"email\":\"med@example.com\",\"seatClass\":\"BUSINESS\"}"
curl http://localhost:8080/api/bookings/SP-XXXXXX
curl -X DELETE http://localhost:8080/api/bookings/SP-XXXXXX
```
(The `^` continues a line in Windows cmd. On Linux/macOS use `\`.)

**SOAP (booking-service)**
```
curl http://localhost:8081/ws/bookings.wsdl
```
Open the WSDL in SoapUI or Postman to call `BookTicket`, `GetBooking` and `CancelBooking`. Raw request example:
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bk="http://skyport.com/booking">
  <soapenv:Body>
    <bk:GetBookingRequest><bk:reference>SP-XXXXXX</bk:reference></bk:GetBookingRequest>
  </soapenv:Body>
</soapenv:Envelope>
```
POST it to `http://localhost:8081/ws` with header `Content-Type: text/xml`.

**gRPC (flight-service)** with [grpcurl](https://github.com/fullstorydev/grpcurl) (reflection is enabled)
```
grpcurl -plaintext localhost:9090 list
grpcurl -plaintext -d "{\"flight_number\":\"SP202\"}" localhost:9090 skyport.FlightService/StreamTelemetry
```

## Project layout

```
proto/skyport.proto                  gRPC contract (shared by flight-service and gateway)
flight-service/                      gRPC server
booking-service/src/main/resources/bookings.xsd   SOAP contract (WSDL is generated from it)
gateway/src/main/resources/static/   web UI (index.html, styles.css, app.js)
docker-compose.yml                   runs everything
```

## Ideas to extend it

- Add seat maps and a `ListBookings` SOAP operation
- Add JWT login to the gateway
- Replace simulated flights with real data in `FlightGrpcService`
- Add a healthcheck and Prometheus metrics to each service
