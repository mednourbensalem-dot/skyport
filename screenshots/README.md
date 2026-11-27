# Screenshot checklist

This folder is intentionally prepared without generated or sample screenshots. Capture the real screens from the running app at [http://localhost:8080](http://localhost:8080), then save the image files here.

## Capture these screens

1. **Live flight dashboard** — show the SkyPort heading, live map with aircraft, flight inspector, and live status. Save as `01-live-flight-dashboard.png`.
2. **Booking review** — open a real flight's booking flow, complete passenger details and seat selection, then capture the final review step before confirming. Save as `02-booking-review.png`.
3. **Booking confirmation** — confirm the booking and capture the resulting **My tickets** card showing the confirmed status and booking reference. Save as `03-booking-confirmation.png`.
4. **Optional gRPC telemetry** — run the `grpcurl` telemetry command in the project README and capture the terminal output while messages are streaming. Save as `04-grpcurl-telemetry.png`.

Use actual application and terminal output only. Do not edit screenshots to imply a result that was not produced by the running project.
