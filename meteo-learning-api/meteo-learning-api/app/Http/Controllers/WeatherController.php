<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\WeatherAPI;
use App\Models\WeatherData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class WeatherController extends Controller
{
    public function getCurrentWeather(Request $request)
    {
        $validated = $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'provider' => 'in:openweathermap,weatherapi|nullable'
        ]);

        $provider = $validated['provider'] ?? config('services.weather.default_provider');

        try {
            $weather = WeatherAPI::getWeatherData(
                $validated['latitude'],
                $validated['longitude'],
                $provider
            );

            // Sauvegarder les données dans la base
            $weatherData = WeatherData::create([
                'user_id' => auth()->id(),
                'temperature' => $weather['main']['temp'],
                'humidity' => $weather['main']['humidity'],
                'pressure' => $weather['main']['pressure'],
                'wind_speed' => $weather['wind']['speed'],
                'wind_direction' => $weather['wind']['deg'],
                'precipitation' => isset($weather['rain']['1h']) ? $weather['rain']['1h'] : 0,
                'cloud_cover' => $weather['clouds']['all'],
                'location' => $weather['name'],
                'timestamp' => now()
            ]);

            return response()->json([
                'success' => true,
                'data' => $weather,
                'saved' => $weatherData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getForecast(Request $request)
    {
        $validated = $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'days' => 'integer|min:1|max:14',
            'provider' => 'in:openweathermap,weatherapi|nullable'
        ]);

        $provider = $validated['provider'] ?? config('services.weather.default_provider');
        $days = $validated['days'] ?? 3;

        try {
            $forecast = WeatherAPI::getForecast(
                $validated['latitude'],
                $validated['longitude'],
                $days,
                $provider
            );

            // Sauvegarder les prévisions dans la base
            foreach ($forecast['list'] ?? $forecast['forecast']['forecastday'] as $day) {
                Forecast::create([
                    'user_id' => auth()->id(),
                    'date' => $day['dt'] ?? $day['date'],
                    'temperature_min' => $day['main']['temp_min'] ?? $day['day']['mintemp_c'],
                    'temperature_max' => $day['main']['temp_max'] ?? $day['day']['maxtemp_c'],
                    'humidity' => $day['main']['humidity'] ?? $day['day']['avghumidity'],
                    'wind_speed' => $day['wind']['speed'] ?? $day['day']['maxwind_kph'] / 3.6,
                    'wind_direction' => $day['wind']['deg'] ?? $day['day']['wind_degree'],
                    'precipitation_probability' => $day['pop'] ?? $day['day']['daily_chance_of_rain'],
                    'weather_condition' => $day['weather'][0]['main'] ?? $day['day']['condition']['text'],
                    'location' => $forecast['city']['name'] ?? $forecast['location']['name']
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $forecast
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserWeatherData(Request $request)
    {
        $validated = $request->validate([
            'limit' => 'integer|min:1|max:100',
            'start_date' => 'date',
            'end_date' => 'date',
            'location' => 'string|nullable'
        ]);

        $query = WeatherData::where('user_id', auth()->id());

        if ($validated['start_date']) {
            $query->where('timestamp', '>=', $validated['start_date']);
        }

        if ($validated['end_date']) {
            $query->where('timestamp', '<=', $validated['end_date']);
        }

        if ($validated['location']) {
            $query->where('location', 'like', "%{$validated['location']}%");
        }

        $weatherData = $query->orderBy('timestamp', 'desc')
            ->limit($validated['limit'] ?? 10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $weatherData
        ]);
    }

    public function getUserForecasts(Request $request)
    {
        $validated = $request->validate([
            'limit' => 'integer|min:1|max:100',
            'start_date' => 'date',
            'end_date' => 'date',
            'location' => 'string|nullable'
        ]);

        $query = Forecast::where('user_id', auth()->id());

        if ($validated['start_date']) {
            $query->where('date', '>=', $validated['start_date']);
        }

        if ($validated['end_date']) {
            $query->where('date', '<=', $validated['end_date']);
        }

        if ($validated['location']) {
            $query->where('location', 'like', "%{$validated['location']}%");
        }

        $forecasts = $query->orderBy('date', 'desc')
            ->limit($validated['limit'] ?? 10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $forecasts
        ]);
    }
}
