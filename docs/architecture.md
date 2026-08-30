# Architecture

```mermaid
flowchart LR
  Browser[React SPA] -->|Bearer API requests| API[Laravel /api/v1]
  API --> Planner[ItineraryPlannerService]
  API --> DB[(MySQL)]
```

The frontend uses route-level UI modules and a lazy-loaded React Three Fiber scene. Laravel controllers validate requests, delegate itinerary calculations to a service, and expose versioned JSON endpoints.
