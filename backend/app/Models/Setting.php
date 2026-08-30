<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    protected $casts = [
        'value' => 'string',
    ];

    public static function map(): array
    {
        return static::query()
            ->pluck('value', 'key')
            ->map(fn ($value) => (string) $value)
            ->toArray();
    }

    public static function upsertMany(array $values): void
    {
        foreach ($values as $key => $value) {
            static::updateOrCreate(
                ['key' => (string) $key],
                ['value' => $value === null ? '' : (string) $value],
            );
        }
    }

    public static function defaults(): array
    {
        return [
            'site_name' => 'Visit Flow',
            'tagline' => 'Local Tourist Day Visit Planner',
            'support_email' => 'support@visitflow.test',
            'support_phone' => '+94 00 000 0000',
            'map_center_lat' => '7.4129',
            'map_center_lng' => '81.8271',
            'map_zoom' => '12',
        ];
    }
}