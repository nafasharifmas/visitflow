<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TripPlan;
use Illuminate\Http\Request;

class TripPlanController extends Controller
{
    public function index(Request $request)
    {
        return [
            'data' => $request->user()->tripPlans()->with('items.place.category')->latest()->get(),
        ];
    }

    public function show(Request $request, TripPlan $tripPlan)
    {
        abort_unless($tripPlan->user_id === $request->user()->id, 403);

        return ['data' => $tripPlan->load('items.place.category')];
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:120',
            'travel_date' => 'required|date',
            'start_latitude' => 'required|numeric',
            'start_longitude' => 'required|numeric',
            'start_address' => 'nullable|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'total_distance' => 'nullable|numeric|min:0',
            'total_travel_minutes' => 'nullable|integer|min:0',
            'items' => 'required|array|min:1',
            'items.*.place_id' => 'required|exists:places,id',
            'items.*.position' => 'required|integer|min:1',
            'items.*.planned_arrival_time' => 'nullable|date_format:H:i',
            'items.*.planned_departure_time' => 'nullable|date_format:H:i',
            'items.*.travel_minutes' => 'nullable|integer|min:0',
            'items.*.visit_minutes' => 'nullable|integer|min:0',
            'items.*.distance_from_previous' => 'nullable|numeric|min:0',
        ]);

        $tripPlan = $request->user()->tripPlans()->create(collect($data)->except('items')->all());

        foreach ($data['items'] as $item) {
            $tripPlan->items()->create($item);
        }

        return response()->json(['data' => $tripPlan->load('items.place.category')], 201);
    }

    public function update(Request $request, TripPlan $tripPlan)
    {
        abort_unless($tripPlan->user_id === $request->user()->id, 403);

        $data = $request->validate([
            'title' => 'sometimes|string|max:120',
            'travel_date' => 'sometimes|date',
            'start_latitude' => 'sometimes|numeric',
            'start_longitude' => 'sometimes|numeric',
            'start_address' => 'nullable|string|max:255',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i',
            'total_distance' => 'sometimes|numeric|min:0',
            'total_travel_minutes' => 'sometimes|integer|min:0',
            'items' => 'sometimes|array|min:1',
            'items.*.place_id' => 'required_with:items|exists:places,id',
            'items.*.position' => 'required_with:items|integer|min:1',
            'items.*.planned_arrival_time' => 'nullable|date_format:H:i',
            'items.*.planned_departure_time' => 'nullable|date_format:H:i',
            'items.*.travel_minutes' => 'nullable|integer|min:0',
            'items.*.visit_minutes' => 'nullable|integer|min:0',
            'items.*.distance_from_previous' => 'nullable|numeric|min:0',
        ]);

        $tripPlan->update(collect($data)->except('items')->all());

        if (array_key_exists('items', $data)) {
            $tripPlan->items()->delete();
            foreach ($data['items'] as $item) {
                $tripPlan->items()->create($item);
            }
        }

        return ['data' => $tripPlan->load('items.place.category')];
    }

    public function destroy(Request $request, TripPlan $tripPlan)
    {
        abort_unless($tripPlan->user_id === $request->user()->id, 403);
        $tripPlan->delete();

        return response()->noContent();
    }
}
