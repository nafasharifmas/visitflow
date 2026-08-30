<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Facility;
use App\Models\Place;
use App\Models\Review;
use App\Models\Setting;
use App\Models\TripPlan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function overview()
    {
        return response()->json([
            'data' => [
                'users_total' => User::count(),
                'admins_total' => User::where('role', 'admin')->count(),
                'active_places' => Place::active()->count(),
                'featured_places' => Place::active()->where('is_featured', true)->count(),
                'pending_reviews' => Review::where('status', 'pending')->count(),
                'approved_reviews' => Review::where('status', 'approved')->count(),
                'categories_total' => Category::count(),
                'trip_plans_total' => TripPlan::count(),
                'favourites_total' => DB::table('favourites')->count(),
                'recent_places' => Place::latest()->limit(5)->get(['id', 'name', 'slug', 'status']),
                'recent_users' => User::latest()->limit(5)->get(['id', 'name', 'email', 'role']),
            ],
        ]);
    }

    protected function placeQuery()
    {
        return Place::with(['category', 'images', 'facilities'])->withAvg([
            'reviews as average_rating' => fn ($query) => $query->where('status', 'approved'),
        ], 'rating');
    }

    protected function placeRules(?Place $place = null): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['required', 'string', 'max:160', Rule::unique('places', 'slug')->ignore($place?->id)],
            'short_description' => ['required', 'string', 'max:500'],
            'full_description' => ['nullable', 'string'],
            'address' => ['required', 'string', 'max:255'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'distance_from_home' => ['required', 'numeric', 'min:0'],
            'opening_time' => ['required', 'date_format:H:i'],
            'closing_time' => ['required', 'date_format:H:i', 'after:opening_time'],
            'visit_duration_minutes' => ['required', 'integer', 'min:1', 'max:1440'],
            'travel_tips' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'is_featured' => ['required', 'boolean'],
            'facilities' => ['sometimes', 'array'],
            'facilities.*' => ['integer', 'exists:facilities,id'],
            'images' => ['sometimes', 'array'],
            'images.*.image_url' => ['required_with:images', 'url', 'max:2048'],
            'images.*.alt_text' => ['nullable', 'string', 'max:255'],
            'images.*.is_primary' => ['nullable', 'boolean'],
            'images.*.sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    protected function syncPlaceRelations(Place $place, array $data): void
    {
        if (array_key_exists('facilities', $data)) {
            $place->facilities()->sync($data['facilities']);
        }

        if (array_key_exists('images', $data)) {
            $place->images()->delete();
            foreach ($data['images'] as $image) {
                $place->images()->create([
                    'image_url' => $image['image_url'],
                    'alt_text' => $image['alt_text'] ?? null,
                    'is_primary' => (bool) ($image['is_primary'] ?? false),
                    'sort_order' => $image['sort_order'] ?? 0,
                ]);
            }
        }
    }

    public function places()
    {
        return response()->json([
            'data' => $this->placeQuery()->latest()->get(),
            'meta' => [
                'categories' => Category::orderBy('name')->get(['id', 'name', 'slug']),
                'facilities' => Facility::orderBy('name')->get(['id', 'name', 'icon']),
            ],
        ]);
    }

    public function place(Place $place)
    {
        return response()->json([
            'data' => $this->placeQuery()->whereKey($place->id)->firstOrFail(),
            'meta' => [
                'categories' => Category::orderBy('name')->get(['id', 'name', 'slug']),
                'facilities' => Facility::orderBy('name')->get(['id', 'name', 'icon']),
            ],
        ]);
    }

    public function storePlace(Request $request)
    {
        $data = $request->validate($this->placeRules());

        $place = DB::transaction(function () use ($data) {
            $place = Place::create(Arr::except($data, ['facilities', 'images']));
            $this->syncPlaceRelations($place, $data);

            return $place;
        });

        return response()->json([
            'data' => $this->placeQuery()->whereKey($place->id)->firstOrFail(),
        ], 201);
    }

    public function updatePlace(Request $request, Place $place)
    {
        $data = $request->validate($this->placeRules($place));

        DB::transaction(function () use ($place, $data) {
            $place->update(Arr::except($data, ['facilities', 'images']));
            $this->syncPlaceRelations($place, $data);
        });

        return response()->json([
            'data' => $this->placeQuery()->whereKey($place->id)->firstOrFail(),
        ]);
    }

    public function destroyPlace(Place $place)
    {
        $place->delete();

        return response()->noContent();
    }

    public function users()
    {
        return response()->json([
            'data' => User::query()->latest()->get([
                'id',
                'name',
                'email',
                'role',
                'status',
                'phone',
                'profile_image',
                'created_at',
                'updated_at',
            ]),
        ]);
    }

    public function user(User $user)
    {
        return response()->json([
            'data' => $user->only([
                'id',
                'name',
                'email',
                'role',
                'status',
                'phone',
                'profile_image',
                'created_at',
                'updated_at',
            ]),
        ]);
    }

public function updateUser(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', Rule::in(['admin', 'user'])],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'phone' => ['nullable', 'string', 'max:30'],
            'profile_image' => ['nullable', 'url', 'max:2048'],
        ]);

        $user->update($data);

        return response()->json([
            'data' => $user->only([
                'id',
                'name',
                'email',
                'role',
                'status',
                'phone',
                'profile_image',
                'created_at',
                'updated_at',
            ]),
        ]);
    }

    public function categories()
    {
        return response()->json([
            'data' => Category::orderBy('name')->get(),
        ]);
    }

    public function category(Category $category)
    {
        return response()->json([
            'data' => $category,
        ]);
    }

    public function storeCategory(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['required', 'string', 'max:120', 'alpha_dash', Rule::unique('categories', 'slug')],
            'description' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:100'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);

        $category = Category::create($data);

        return response()->json(['data' => $category], 201);
    }

    public function updateCategory(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['required', 'string', 'max:120', 'alpha_dash', Rule::unique('categories', 'slug')->ignore($category->id)],
            'description' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:100'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);

        $category->update($data);

        return response()->json(['data' => $category->fresh()]);
    }

    public function destroyCategory(Category $category)
    {
        $category->delete();

        return response()->noContent();
    }

    public function reviews(Request $request)
    {
        $query = Review::with(['user:id,name', 'place:id,name,slug'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return $query->paginate(min((int) $request->get('per_page', 20), 100));
    }

    public function updateReview(Request $request, Review $review)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['pending', 'approved', 'rejected'])],
        ]);

        $review->update($data);

        return response()->json([
            'data' => $review->load(['user:id,name', 'place:id,name,slug']),
        ]);
    }

    public function destroyReview(Review $review)
    {
        $review->delete();

        return response()->noContent();
    }

    public function settings()
    {
        return response()->json([
            'data' => array_merge(Setting::defaults(), Setting::map()),
        ]);
    }

    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'site_name' => ['required', 'string', 'max:100'],
            'tagline' => ['nullable', 'string', 'max:200'],
            'support_email' => ['nullable', 'email', 'max:150'],
            'support_phone' => ['nullable', 'string', 'max:40'],
            'map_center_lat' => ['nullable', 'numeric', 'between:-90,90'],
            'map_center_lng' => ['nullable', 'numeric', 'between:-180,180'],
            'map_zoom' => ['nullable', 'integer', 'between:1,19'],
        ]);

        $data = array_map(fn ($value) => $value === null ? '' : (string) $value, $data);
        Setting::upsertMany($data);

        return response()->json([
            'data' => array_merge(Setting::defaults(), Setting::map()),
        ]);
    }

    public function upload(Request $request)
    {
        $data = $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
        ]);

        $path = $data['image']->store('uploads', 'public');

        return response()->json([
            'data' => [
                'url' => asset('storage/'.$path),
            ],
        ], 201);
    }
}
