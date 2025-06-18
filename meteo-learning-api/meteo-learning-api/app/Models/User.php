<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Progression;
use App\Models\Certificate;
use App\Models\ChatMessage;
use App\Models\Course;
use App\Models\Quiz;
use App\Models\WeatherData;
use App\Models\Forecast;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'password',
        'role',
        'progression_id',
        'certificate_id',
        'first_name',
        'last_name',
        'domain',
        'language_preference',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'role' => 'string',
        'language_preference' => 'string',
    ];

    // Relations

    public function progression(): HasOne
    {
        return $this->hasOne(Progression::class);
    }

    public function certificate(): HasOne
    {
        return $this->hasOne(Certificate::class);
    }

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class)
            ->withPivot('progress', 'completed_at')
            ->withTimestamps();
    }

    public function quizzes(): BelongsToMany
    {
        return $this->belongsToMany(Quiz::class)
            ->withPivot('score', 'completed_at')
            ->withTimestamps();
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function weatherData(): HasMany
    {
        return $this->hasMany(WeatherData::class);
    }

    public function forecasts(): HasMany
    {
        return $this->hasMany(Forecast::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    // Vérifie si l'utilisateur est un administrateur
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
