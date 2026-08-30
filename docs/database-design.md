# Database design

`categories` groups `places`. Users can favourite and review places. Saved itineraries are stored in `trip_plans` and ordered `trip_plan_items`. Uniqueness constraints prevent duplicate favourites and duplicate reviews per user/place.

```mermaid
erDiagram
  USERS ||--o{ FAVOURITES : saves
  PLACES ||--o{ FAVOURITES : is_saved
  CATEGORIES ||--o{ PLACES : categorises
  USERS ||--o{ TRIP_PLANS : owns
  TRIP_PLANS ||--o{ TRIP_PLAN_ITEMS : contains
  PLACES ||--o{ TRIP_PLAN_ITEMS : schedules
```
