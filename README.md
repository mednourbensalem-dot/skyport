# SkyPort

SkyPort is a Java Spring Boot microservices project demonstrating REST/SSE, gRPC, SOAP, JDBC, and PostgreSQL through a live flight-operations and booking application. The flight data is simulated; confirmed bookings are persisted in PostgreSQL.

> **GitHub repository description:** Java Spring Boot microservices project demonstrating REST/SSE, gRPC, SOAP, JDBC, and PostgreSQL through a live flight-operations and booking demo.
>
> **Suggested GitHub topics:** `java`, `grpc`, `soap`, `rest`, `spring-boot`, `docker`, `postgresql`, `microservices`
>
> Set the description and topics in the repository's GitHub settings; they cannot be set by editing this README.

## Architecture

Open or edit the [SkyPort architecture diagram](docs/architecture.drawio) in diagrams.net / draw.io.

The browser uses the gateway's REST API, and receives live updates over SSE. The gateway calls the flight service over gRPC and the booking service over SOAP. The booking service persists booking data to PostgreSQL using Spring Data JPA and the PostgreSQL JDBC driver.

| Component | Responsibilities |
|---|---|
| Browser | Serves the live flight map, flight planner, booking flow, tickets, and operations console UI. |
| `gateway` | Spring Boot REST API and static UI on port `8080`; adapts gRPC and SOAP calls, and fans telemetry and activity out over SSE. |
| `flight-service` | gRPC service on port `9090`; provides the simulated flight catalog, search, fleet statistics, and telemetry streams. |
| `booking-service` | Spring-WS SOAP service on port `8081`; quotes fares, manages seats and bookings, handles check-in, and reports booking statistics. |
| `postgres` | PostgreSQL 16 database for persistent booking data, using the Compose volume `pgdata`. |

The editable draw.io diagram is [docs/architecture.drawio](docs/architecture.drawio).

## Technologies

- Java 21 and Spring Boot 3.2.5
- Spring Web MVC for the gateway REST API and Spring Web Services for SOAP
- Server-Sent Events (SSE) for browser telemetry and activity updates
- gRPC Java 1.62.2 and Protocol Buffers 3.25.3 for flight-service communication
- Spring Data JPA, the PostgreSQL JDBC driver, and PostgreSQL 16
- Spring Security and JWT for the operations console
- Docker Compose for running the complete stack

## Prerequisites

- Docker Desktop (or Docker Engine) with the Docker Compose v2 plugin
- For running the Maven tests locally: Java 21 and Maven 3.9+
- Optional, for the gRPC telemetry alternative: [grpcurl](https://github.com/fullstorydev/grpcurl)

## Run with Docker Compose

From the repository root, build and start all services:

```shell
docker compose up --build
```

The first build downloads Maven dependencies and may take a few minutes. When the services are ready, open [http://localhost:8080](http://localhost:8080). The individual service ports are `8080` (gateway/UI), `8081` (booking SOAP/WSDL), and `9090` (flight-service gRPC).

To start in the background and follow logs:

```shell
docker compose up --build -d
docker compose logs -f gateway flight-service booking-service postgres
```

Stop the foreground stack with `Ctrl+C`, or stop a background stack with:

```shell
docker compose down
```

Booking data persists in the `pgdata` volume. To remove the containers **and** the database volume, use `docker compose down -v`; this permanently deletes the stored booking data.

The operations console login is username `admin` and the development password `skyport-admin` by default. Override the development credentials before starting the Compose stack if needed:

```powershell
$env:ADMIN_PASSWORD = "choose-a-password"
$env:JWT_SECRET = "use-a-long-random-secret-value"
docker compose up --build
```

Do not use the development defaults for a public deployment.

## Use the application

### Live flight interface

Open [http://localhost:8080](http://localhost:8080). The live operations section displays the simulated fleet map, flight telemetry, and activity feed. The departures section lets you search the available flights and routes.

### Create a booking and view its confirmation

1. In the live flight inspector, click **Book this flight** for the selected aircraft, or choose a flight from the departures list.
2. Enter the passenger name and email address, select a cabin, then continue.
3. Choose an available seat on the seat-map step, or use **Let us pick**. Continue to review the fare and booking details.
4. Click **Confirm booking**. The app displays a success notification with the seat and booking reference, then scrolls to **My tickets**.
5. Capture the confirmation ticket in the **My tickets** section. The ticket shows the reference, passenger, flight, seat, and confirmed status.

The screen capture checklist and suggested filenames are in [screenshots/README.md](screenshots/README.md). No screenshots are included; capture them from a running application.

### Optional: inspect the gRPC telemetry stream

With the Compose services running and `grpcurl` installed, run:

```shell
grpcurl -plaintext localhost:9090 skyport.FlightService/StreamFleet
```

This prints the streamed telemetry messages for the fleet. Stop the continuous stream with `Ctrl+C`. The flight service enables gRPC reflection, so this command does not need a local `.proto` argument.

## Services and API

The gateway is the browser-facing API. It translates requests to the backend protocol used by each service.

| Gateway method and path | Behavior |
|---|---|
| `GET /api/flights` | Lists flights from the gRPC flight service. |
| `GET /api/flights/search?from=TUN&to=FCO` | Searches flights by origin and destination through gRPC. |
| `GET /api/flights/{number}` | Gets one flight through gRPC. |
| `GET /api/fleet/stats` | Gets fleet statistics through gRPC. |
| `GET /api/telemetry` | Returns the latest telemetry frame per aircraft. |
| `GET /api/telemetry/stream` | Streams telemetry to the browser over SSE. |
| `POST /api/fare/quote` | Gets a fare quote from the SOAP booking service using the flight's gRPC base fare. |
| `GET /api/seats?flightNumber=SP101&seatClass=BUSINESS` | Gets the seat map from the SOAP booking service. |
| `POST /api/bookings` | Creates a booking through SOAP; the gateway first fetches the flight's base fare through gRPC. |
| `GET /api/bookings?email=passenger@example.com` | Lists the passenger's bookings through SOAP. |
| `GET /api/bookings/{reference}` | Gets a booking through SOAP. |
| `DELETE /api/bookings/{reference}` | Cancels a booking through SOAP. |
| `POST /api/bookings/{reference}/checkin` | Checks in a passenger through SOAP. |
| `GET /api/events` and `GET /api/events/stream` | Reads recent activity or subscribes to activity over SSE. |
| `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/refresh` | Signs in and manages the JWT session. |
| `GET /api/admin/stats`, `GET /api/admin/ping` | Operations endpoints requiring the admin role. |

The booking service WSDL is available at [http://localhost:8081/ws/bookings.wsdl](http://localhost:8081/ws/bookings.wsdl) when the stack is running. It exposes the booking, seat-map, fare-quote, check-in, and statistics SOAP operations.

## Test

The existing automated tests are in the `gateway` module. On a clean checkout, copy the shared Protocol Buffers contract into the gateway module before running the tests.

PowerShell:

```powershell
New-Item -ItemType Directory -Force gateway\src\main\proto
Copy-Item proto\* gateway\src\main\proto\ -Recurse -Force
mvn -f gateway\pom.xml test
```

Linux/macOS:

```shell
mkdir -p gateway/src/main/proto
cp -R proto/. gateway/src/main/proto/
mvn -f gateway/pom.xml test
```

The GitHub Actions workflow performs the same proto-copy step and runs `mvn test` from `gateway/`.

## Project layout

```text
docs/architecture.drawio       Editable service and protocol diagram
screenshots/                   Folder for screenshots captured from a running app
proto/skyport.proto            Shared gRPC contract
flight-service/                gRPC flight catalog and telemetry server
booking-service/               SOAP booking service and JPA persistence
gateway/                       REST/SSE API, browser UI, and gateway tests
docker-compose.yml             Full-stack local environment
```
