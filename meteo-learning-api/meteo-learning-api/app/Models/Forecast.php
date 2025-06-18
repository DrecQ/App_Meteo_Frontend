<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Forecast extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'temperature_min',
        'temperature_max',
        'humidity',
        'wind_speed',
        'wind_direction',
        'precipitation_probability',
        'weather_condition',
        'location'
    ];

    protected $casts = [
        'date' => 'date',
        'temperature_min' => 'float',
        'temperature_max' => 'float',
        'humidity' => 'float',
        'wind_speed' => 'float',
        'precipitation_probability' => 'float'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
