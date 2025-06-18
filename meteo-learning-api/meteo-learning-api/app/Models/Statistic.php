<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Collection;

class Statistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'value',
        'created_at',
        'course_id',
        'lesson_id',
        'quiz_id',
        'topic_id'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'value' => 'float'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function scopeCompletionRate($query)
    {
        return $query->where('type', 'completion_rate');
    }
}
