# Local Tourist Day-Visit Planner

A React and Laravel application for discovering nearby places and building practical one-day itineraries. The repository currently contains a runnable frontend experience and a Laravel API foundation with bearer-token authentication, place search, featured places, and itinerary preview logic.

## Run locally

1. In `backend`, configure `.env`, run `php artisan key:generate`, then `php artisan migrate --seed`.
2. Start the API with `php artisan serve`.
3. In `frontend`, copy `.env.example` to `.env`, run `npm install`, then `npm run dev`.

Development accounts: `admin@example.com` / `Password123!` and `user@example.com` / `Password123!`. Replace sample places and media with verified, licensed local content before publication.

## Current limitations

The map page presently uses an accessible fallback while map/API wiring is expanded. The starter place imagery is generated styling rather than licensed tourism photography; a production asset register is still required.
