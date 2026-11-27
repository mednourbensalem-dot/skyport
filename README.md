# SkyPort

A live flight-operations and booking site that uses **REST**, **SOAP**, **gRPC** and **SSE** together, running in Docker with **Spring Security + JWT**.

```
Browser --REST/SSE--> gateway (8080) --gRPC--> flight-service (9090)
                          |
                          +-----SOAP--> booking-service (8081) --JDBC--> PostgreSQL
```

| Service | Tech | What it does |
|---|---|---|
| `flight-service` | Java 21, gRPC (unary + 2 server streams) | Fleet catalog, route search, aggregate stats, live telemetry (altitude, speed, wind, fuel…) |
| `booking-service` | Java 21, Spring-WS (SOAP), JPA | Books seats, quotes fares, sells seat maps, checks passengers in, stores everything in PostgreSQL |
| `gateway` | Java 21, Spring Boot (REST, SSE), Spring Security, JWT | Serves the UI and the REST API, fans telemetry out to browsers, protects the console |
| `postgres` | PostgreSQL 16 | Ticket storage (Docker volume `pgdata`) |

## Run it

Requires Docker Desktop. From this folder:

```
docker compose up --build
```

The first build downloads Maven dependencies and takes a few minutes. Then open **http://localhost:8080**.

Sign in to the operations console (bottom of the page) with user `admin` and the password from `ADMIN_PASSWORD` (default `skyport-admin`). Override both secrets when starting the stack:

```
ADMIN_PASSWORD=my-password JWT_SECRET=a-very-long-random-secret-value-123456 docker compose up --build
```

Stop with `Ctrl + C`. `docker compose down` removes containers (add `-v` to also delete tickets).

## What the site does

- **Live map + inspector** — every aircraft moves along its route, with altitude, speed, heading, ETA, wind, outside temperature, fuel and vertical speed updated once per second.
- **Flight planner** — filters departures by origin, destination and cabin.
- **Three-step booking** — passenger details, a real seat map fetched from the SOAP service (window/aisle/extra-legroom fees), then a fare breakdown before confirming.
- **My tickets** — boarding-pass cards with boarding group, PDF download, cancellation and check-in (seat can be changed while checking in).
- **Operations console** — JWT-protected dashboard with fleet numbers (gRPC) and booking/revenue numbers (SOAP).
- **Live activity** — SSE feed of bookings, cancellations and check-ins.
- **EN / FR / AR** with right-to-left support.

## REST API (gateway, port 8080)

| Method | Path | Notes |
|---|---|---|
| GET | `/api/flights` | full catalog (gRPC `ListFlights`) |
| GET | `/api/flights/{number}` | one flight |
| GET | `/api/flights/search?from=TUN&to=FCO` | gRPC `SearchFlights` |
| GET | `/api/fleet/stats` | gRPC `FleetStats` |
| GET | `/api/telemetry` | latest frame per aircraft |
| GET | `/api/telemetry/stream` | SSE, one frame per second |
| POST | `/api/fare/quote` | `{flightNumber, seatClass, passengers, seat}` → SOAP `QuoteTicket` |
| GET | `/api/seats?flightNumber=SP101&seatClass=BUSINESS` | SOAP `SeatMap` |
| POST | `/api/bookings` | `{flightNumber, passengerName, email, seatClass, seat}` → SOAP `BookTicket` |
| GET | `/api/bookings?email=` | SOAP `ListBookings` |
| GET | `/api/bookings/{reference}` | SOAP `GetBooking` |
| DELETE | `/api/bookings/{reference}` | SOAP `CancelBooking` |
| POST | `/api/bookings/{reference}/checkin` | `{seat}` → SOAP `CheckIn` |
| GET | `/api/events`, `/api/events/stream` | live activity (REST + SSE) |
| POST | `/api/auth/login` | `{username, password}` → signed JWT |
| GET | `/api/auth/me`, POST `/api/auth/refresh` | token inspection / renewal |
| GET | `/api/admin/stats`, `/api/admin/ping` | requires `ROLE_ADMIN` |

Example:

```
curl http://localhost:8080/api/flights
curl -X POST http://localhost:8080/api/fare/quote -H "Content-Type: application/json" ^
  -d "{\"flightNumber\":\"SP101\",\"seatClass\":\"BUSINESS\",\"seat\":\"5C\"}"
curl -X POST http://localhost:8080/api/bookings -H "Content-Type: application/json" ^
  -d "{\"flightNumber\":\"SP101\",\"passengerName\":\"Med Nour\",\"email\":\"med@example.com\",\"seatClass\":\"BUSINESS\",\"seat\":\"5C\"}"
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"skyport-admin\"}"
```

(The `^` continues a line in Windows cmd. On Linux/macOS use `\`.)

## SOAP (booking-service, port 8081)

WSDL: `http://localhost:8081/ws/bookings.wsdl` — operations: `BookTicket`, `GetBooking`, `CancelBooking`, `ListBookings`, `CheckIn`, `SeatMap`, `QuoteTicket`, `GetStats`.

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bk="http://skyport.com/booking">
  <soapenv:Body>
    <bk:QuoteTicketRequest>
      <bk:basePrice>155</bk:basePrice>
      <bk:seatClass>BUSINESS</bk:seatClass>
      <bk:passengers>1</bk:passengers>
      <bk:seat>5C</bk:seat>
    </bk:QuoteTicketRequest>
  </soapenv:Body>
</soapenv:Envelope>
```

POST it to `http://localhost:8081/ws` with `Content-Type: text/xml`.

## gRPC (flight-service, port 9090)

Reflection is enabled, so [grpcurl](https://github.com/fullstorydev/grpcurl) works without the `.proto`:

```
grpcurl -plaintext localhost:9090 list
grpcurl -plaintext -d "{\"origin\":\"TUN\",\"destination\":\"FCO\"}" localhost:9090 skyport.FlightService/SearchFlights
grpcurl -plaintext localhost:9090 skyport.FlightService/FleetStats
grpcurl -plaintext -d "{\"flight_number\":\"SP202\"}" localhost:9090 skyport.FlightService/StreamTelemetry
```

## Project layout

```
proto/skyport.proto                          gRPC contract (shared by flight-service and gateway)
flight-service/                              gRPC server: catalog, search, stats, telemetry streams
booking-service/src/main/resources/bookings.xsd   SOAP contract (WSDL generated from it)
gateway/src/main/resources/static/           web UI (index.html, styles.css, app.js)
docker-compose.yml                           runs everything
```

## Notes

- Fares are computed once, in `booking-service` (`Pricing`), and quoted through SOAP, so the price shown in the browser is the price stored in PostgreSQL.
- Seat maps combine real bookings with deterministic simulated occupancy, so the cabin looks realistic without a second database.
- JWT signing uses `JWT_SECRET`; the console user is created from `ADMIN_PASSWORD` at startup.
- The Spring Boot parent is still 3.2.5, so a container scan will still report the Tomcat, Spring Security and Jackson CVEs listed in the project history. Upgrading the parent to a current 3.x release is the fix.
