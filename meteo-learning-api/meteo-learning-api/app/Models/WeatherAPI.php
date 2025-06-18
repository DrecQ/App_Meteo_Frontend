<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class WeatherAPI extends Model
{
    use HasFactory;

    protected $fillable = [
        'api_key',
        'provider',
        'last_updated_at',
        'status'
    ];

    protected $casts = [
        'last_updated_at' => 'datetime',
        'status' => 'boolean'
    ];

    public static function getWeatherData($latitude, $longitude, $provider = 'openweathermap')
    {
        $cacheKey = "weather_{$latitude}_{$longitude}_{$provider}";
        
        return Cache::remember($cacheKey, now()->addHours(1), function() use ($latitude, $longitude, $provider) {
            return self::fetchWeatherData($latitude, $longitude, $provider);
        });
    }

    private static function fetchWeatherData($latitude, $longitude, $provider)
    {
        $apiKey = config('services.weather.api_key');
        
        switch ($provider) {
            case 'openweathermap':
                return self::fetchOpenWeatherMap($latitude, $longitude, $apiKey);
                break;
            case 'weatherapi':
                return self::fetchWeatherAPI($latitude, $longitude, $apiKey);
                break;
            default:
                throw new \InvalidArgumentException("Provider {$provider} not supported");
        }
    }

    private static function fetchOpenWeatherMap($latitude, $longitude, $apiKey)
    {
        $response = Http::get("https://api.openweathermap.org/data/2.5/weather", [
            'lat' => $latitude,
            'lon' => $longitude,
            'appid' => $apiKey,
            'units' => 'metric'
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception('Failed to fetch weather data: ' . $response->body());
    }

    private static function fetchWeatherAPI($latitude, $longitude, $apiKey)
    {
        $response = Http::get("https://api.weatherapi.com/v1/current.json", [
            'key' => $apiKey,
            'q' => "{$latitude},{$longitude}",
            'aqi' => 'no'
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception('Failed to fetch weather data: ' . $response->body());
    }

    public static function getForecast($latitude, $longitude, $days = 3, $provider = 'openweathermap')
    {
        $cacheKey = "forecast_{$latitude}_{$longitude}_{$provider}_{$days}";
        
        return Cache::remember($cacheKey, now()->addHours(1), function() use ($latitude, $longitude, $days, $provider) {
            return self::fetchForecast($latitude, $longitude, $days, $provider);
        });
    }

    private static function fetchForecast($latitude, $longitude, $days, $provider)
    {
        $apiKey = config('services.weather.api_key');
        
        switch ($provider) {
            case 'openweathermap':
                return self::fetchOpenWeatherMapForecast($latitude, $longitude, $days, $apiKey);
                break;
            case 'weatherapi':
                return self::fetchWeatherAPIForecast($latitude, $longitude, $days, $apiKey);
                break;
            default:
                throw new \InvalidArgumentException("Provider {$provider} not supported");
        }
    }

    private static function fetchOpenWeatherMapForecast($latitude, $longitude, $days, $apiKey)
    {
        $response = Http::get("https://api.openweathermap.org/data/2.5/forecast", [
            'lat' => $latitude,
            'lon' => $longitude,
            'appid' => $apiKey,
            'units' => 'metric',
            'cnt' => $days * 8 // 8 prévisions par jour
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception('Failed to fetch forecast data: ' . $response->body());
    }

    private static function fetchWeatherAPIForecast($latitude, $longitude, $days, $apiKey)
    {
        $response = Http::get("https://api.weatherapi.com/v1/forecast.json", [
            'key' => $apiKey,
            'q' => "{$latitude},{$longitude}",
            'days' => $days,
            'aqi' => 'no'
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception('Failed to fetch forecast data: ' . $response->body());
    }
}
