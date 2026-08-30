<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Place extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'short_description',
        'full_description',
        'address',
        'latitude',
        'longitude',
        'distance_from_home',
        'opening_time',
        'closing_time',
        'visit_duration_minutes',
        'travel_tips',
        'status',
        'is_featured',
        'view_count',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'distance_from_home' => 'float',
        'is_featured' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(PlaceImage::class)->orderBy('sort_order');
    }

    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
