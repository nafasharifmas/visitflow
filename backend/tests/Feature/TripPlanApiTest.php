<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Place;
use App\Models\TripPlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TripPlanApiTest extends TestCase
{
    use RefreshDatabase;

    protected function makePlace(): Place
    {
        $category = Category::create([
            'name' => 'Beach',
            'slug' => 'beach',
            'status' => 'active',
        ]);

        return Place::create([
            'category_id' => $category->id,
            'name' => 'Emerald Coast',
            'slug' => 'emerald-coast',
            'short_description' => 'Sample',
            'full_description' => 'Sample description',
            'address' => 'Beach road',
            'latitude' => 6.0,
            'longitude' => 80.0,
            'distance_from_home' => 5,
            'opening_time' => '06:00',
            'closing_time' => '18:00',
            'visit_duration_minutes' => 60,
            'status' => 'active',
        ]);
    }

    public function test_trip_plans_require_authentication(): void
    {
        $this->getJson('/api/v1/trip-plans')->assertUnauthorized();
    }

    public function test_user_cannot_access_another_users_trip_plan(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $place = $this->makePlace();

        $tripPlan = TripPlan::create([
            'user_id' => $owner->id,
            'title' => 'Private plan',
            'travel_date' => '2026-08-28',
            'start_latitude' => 6.0,
            'start_longitude' => 80.0,
            'start_time' => '08:00',
            'end_time' => '17:00',
        ]);
        $tripPlan->items()->create([
            'place_id' => $place->id,
            'position' => 1,
        ]);

        $this->actingAs($intruder, 'sanctum')
            ->getJson("/api/v1/trip-plans/{$tripPlan->id}")
            ->assertForbidden();
    }
}
