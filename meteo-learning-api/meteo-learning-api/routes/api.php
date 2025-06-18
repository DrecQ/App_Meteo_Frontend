<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\ChatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\BasicTestController;

Route::get('/basic-test', [BasicTestController::class, 'index']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // User routes (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', AuthController::class);
    });

    // Course routes
    Route::apiResource('courses', CourseController::class);

    // Quiz routes
    Route::post('courses/{course}/quizzes', [QuizController::class, 'store']);
    Route::apiResource('quizzes', QuizController::class, ['except' => ['store']]);
    Route::post('quizzes/{quiz}/submit', [QuizController::class, 'submitAnswer']);

    // Chat routes
    Route::get('chat', [ChatController::class, 'index']);
    Route::post('chat', [ChatController::class, 'store']);
    Route::post('chat/{message}/like', [ChatController::class, 'like']);
    Route::delete('chat/{message}', [ChatController::class, 'delete']);

    // Weather routes
    Route::get('weather/current', [WeatherController::class, 'getCurrentWeather']);
    Route::get('weather/forecast', [WeatherController::class, 'getForecast']);
    Route::get('weather/history', [WeatherController::class, 'getUserWeatherData']);
    Route::get('weather/forecasts', [WeatherController::class, 'getUserForecasts']);

    // Statistic routes
    Route::get('statistics', [StatisticController::class, 'index']);
    Route::get('statistics/courses/{course}', [StatisticController::class, 'getCourseStats']);
    Route::get('statistics/user', [StatisticController::class, 'getUserStats']);
    Route::get('statistics/leaderboard', [StatisticController::class, 'getLeaderboard']);
});
