<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Represents a course in the meteorology learning platform.
 */
class Course extends Model
{
    protected $fillable = [
        'title',
        'description',
        'type',
        'category',
        'language',
        'file_path',
        'audio_path',
        'video_path',
        'text_content'
    ];

    protected $casts = [
        'type' => 'string',
        'category' => 'string',
        'language' => 'string'
    ];

    /**
     * Get the quizzes for the course.
     */
    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class);
    }

    /**
     * Get the users enrolled in the course.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->using(Progression::class)
            ->withPivot([
                'score',
                'completed',
                'certificate_generated'
            ])
            ->withTimestamps();
    }

    /**
     * Get the certificates generated for this course.
     */
    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }
}
