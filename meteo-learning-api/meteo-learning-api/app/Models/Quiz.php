<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Represents a quiz in the meteorology learning platform.
 */
class Quiz extends Model
{
    protected $fillable = [
        'course_id',
        'title',
        'description',
        'score',
        'audio_path',
        'text_content',
        'question',
        'correct_answer',
        'option_a',
        'option_b',
        'option_c',
        'option_d'
    ];

    protected $casts = [
        'score' => 'integer'
    ];

    /**
     * Get the course that owns the quiz.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
