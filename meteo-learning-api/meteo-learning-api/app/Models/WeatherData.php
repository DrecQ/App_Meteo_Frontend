<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WeatherData extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'temperature',
        'humidity',
        'pressure',
        'wind_speed',
        'wind_direction',
        'precipitation',
        'cloud_cover',
        'location',
        'timestamp'
    ];

    protected $casts = [
        'temperature' => 'float',
        'humidity' => 'float',
        'pressure' => 'float',
        'wind_speed' => 'float',
        'precipitation' => 'float',
        'cloud_cover' => 'float',
        'timestamp' => 'datetime'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
