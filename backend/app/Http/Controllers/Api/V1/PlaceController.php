<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Place;
use Illuminate\Http\Request;

class PlaceController extends Controller
{
    protected function placeQuery()
    {
        return Place::with([
            'category',
            'images',
            'facilities',
        ])->withAvg([
            'reviews as average_rating' => fn ($query) => $query->where('status', 'approved'),
        ], 'rating');
    }

    public function categories()
    {
        return ['data' => Category::where('status', 'active')->orderBy('name')->get()];
    }

    public function index(Request $request)
    {
        $query = $this->placeQuery()->active();

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('name', 'like', '%'.$search.'%')
                    ->orWhere('short_description', 'like', '%'.$search.'%')
                    ->orWhere('full_description', 'like', '%'.$search.'%');
            });
        }

        if ($request->category) {
            $query->whereHas('category', fn ($builder) => $builder->where('slug', $request->category));
        }

        if ($request->featured !== null) {
            $query->where('is_featured', filter_var($request->featured, FILTER_VALIDATE_BOOLEAN));
        }

        $sort = $request->get('sort', 'distance_asc');
        $column = match ($sort) {
            'name_desc', 'name_asc' => 'name',
            'newest' => 'created_at',
            default => 'distance_from_home',
        };
        $direction = match ($sort) {
            'name_desc', 'distance_desc' => 'desc',
            default => 'asc',
        };

        $query->orderBy($column, $direction);

        return $query->paginate(min((int) $request->get('per_page', 12), 50));
    }

    public function featured()
    {
        return [
            'data' => $this->placeQuery()
                ->active()
                ->where('is_featured', true)
                ->orderBy('distance_from_home')
                ->take(6)
                ->get(),
        ];
    }

    public function show(Place $place)
    {
        abort_unless($place->status === 'active', 404);

        $place->increment('view_count');

        return [
            'data' => $this->placeQuery()
                ->whereKey($place->getKey())
                ->firstOrFail(),
        ];
    }
}
