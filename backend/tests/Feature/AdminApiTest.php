<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Place;
use App\Models\Review;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_users_cannot_access_admin_endpoints(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
            'status' => 'active',
        ]);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/admin/overview')
            ->assertForbidden();
    }

    public function test_admin_can_create_a_place(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);
        $category = Category::create([
            'name' => 'Nature',
            'slug' => 'nature',
            'status' => 'active',
        ]);

        $payload = [
            'category_id' => $category->id,
            'name' => 'Waterfall Ridge',
            'slug' => 'waterfall-ridge',
            'short_description' => 'Short summary',
            'full_description' => 'Detailed description',
            'address' => 'Hill road',
            'latitude' => 6.25,
            'longitude' => 80.52,
            'distance_from_home' => 18.7,
            'opening_time' => '07:00',
            'closing_time' => '18:00',
            'visit_duration_minutes' => 90,
            'travel_tips' => 'Carry water',
            'status' => 'active',
            'is_featured' => true,
            'images' => [
                [
                    'image_url' => 'https://example.com/photo.jpg',
                    'alt_text' => 'Waterfall Ridge',
                    'is_primary' => true,
                    'sort_order' => 0,
                ],
            ],
        ];

        $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/places', $payload)
            ->assertCreated()
            ->assertJsonPath('data.slug', 'waterfall-ridge')
            ->assertJsonPath('data.images.0.image_url', 'https://example.com/photo.jpg');

        $this->assertDatabaseHas('places', [
            'slug' => 'waterfall-ridge',
        ]);
    }

    public function test_admin_user_responses_do_not_expose_password_fields(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);
        $target = User::factory()->create([
            'role' => 'user',
            'status' => 'active',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/v1/admin/users/{$target->id}")
            ->assertOk();

$response->assertJsonMissingPath('data.password');
        $response->assertJsonMissingPath('data.remember_token');
    }

    public function test_admin_can_manage_categories(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        $created = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/categories', [
                'name' => 'Adventure',
                'slug' => 'adventure',
                'description' => 'Active outdoor stops',
                'icon' => 'Mountain',
                'status' => 'active',
            ])
            ->assertCreated()
            ->assertJsonPath('data.slug', 'adventure');

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/admin/categories/{$created->json('data.id')}", [
                'name' => 'Adventure',
                'slug' => 'adventure',
                'description' => 'Active outdoor stops',
                'icon' => 'MountainSnow',
                'status' => 'inactive',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'inactive');

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/v1/admin/categories/{$created->json('data.id')}")
            ->assertNoContent();

        $this->assertDatabaseMissing('categories', ['slug' => 'adventure']);
    }

    public function test_admin_can_moderate_reviews(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $author = User::factory()->create(['role' => 'user', 'status' => 'active']);
        $category = Category::create(['name' => 'Nature', 'slug' => 'nature', 'status' => 'active']);
        $place = Place::create([
            'category_id' => $category->id,
            'name' => 'Falls',
            'slug' => 'falls',
            'short_description' => 'A waterfall',
            'address' => 'Hill road',
            'latitude' => 6.1,
            'longitude' => 80.2,
            'distance_from_home' => 5,
            'opening_time' => '06:00',
            'closing_time' => '18:00',
            'visit_duration_minutes' => 60,
            'status' => 'active',
            'is_featured' => false,
        ]);
        $review = Review::create([
            'user_id' => $author->id,
            'place_id' => $place->id,
            'rating' => 4,
            'comment' => 'Nice place',
            'status' => 'pending',
        ]);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/reviews?status=pending')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/admin/reviews/{$review->id}", ['status' => 'approved'])
            ->assertOk()
            ->assertJsonPath('data.status', 'approved');

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/v1/admin/reviews/{$review->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
    }

    public function test_admin_can_read_and_update_settings(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/settings')
            ->assertOk()
            ->assertJsonPath('data.site_name', 'Visit Flow');

        $this->actingAs($admin, 'sanctum')
            ->putJson('/api/v1/admin/settings', [
                'site_name' => 'Visit Flow Sri Lanka',
                'tagline' => 'Local day visits',
                'support_email' => 'hello@visitflow.test',
                'support_phone' => '+94 77 000 0000',
                'map_center_lat' => 7.5,
                'map_center_lng' => 81.8,
                'map_zoom' => 11,
            ])
            ->assertOk()
            ->assertJsonPath('data.site_name', 'Visit Flow Sri Lanka');

        $this->assertDatabaseHas('settings', ['key' => 'site_name', 'value' => 'Visit Flow Sri Lanka']);
    }
}
