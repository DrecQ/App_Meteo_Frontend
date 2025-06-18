<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Topic;
use App\Models\Lesson;
use App\Models\Quiz;

class Progression extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'current_topic_id',
        'current_lesson_id',
        'completed_lessons',
        'completed_quizzes',
        'total_points',
        'last_activity_at',
        'level',
        'experience_points',
        'next_level_points'
    ];

    protected $casts = [
        'completed_lessons' => 'array',
        'completed_quizzes' => 'array',
        'last_activity_at' => 'datetime',
        'level' => 'integer',
        'experience_points' => 'integer',
        'next_level_points' => 'integer'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function currentTopic(): BelongsTo
    {
        return $this->belongsTo(Topic::class, 'current_topic_id');
    }

    public function currentLesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class, 'current_lesson_id');
    }

    public function getProgressPercentage(): float
    {
        $totalLessons = Lesson::count();
        $completedLessons = count($this->completed_lessons);
        
        return ($totalLessons > 0) ? ($completedLessons / $totalLessons) * 100 : 0;
    }

    public function getNextLesson(): ?Lesson
    {
        if ($this->current_lesson_id) {
            return Lesson::where('order', '>', $this->currentLesson->order)
                ->orderBy('order')
                ->first();
        }
        
        return Lesson::orderBy('order')
            ->first();
    }

    public function updateProgress(Lesson $lesson, int $points = 0): void
    {
        $this->completed_lessons[] = $lesson->id;
        $this->experience_points += $points;
        $this->last_activity_at = now();
        $this->current_lesson_id = $this->getNextLesson()?->id;
        $this->updateLevel();
        $this->save();
    }

    public function updateQuizProgress(Quiz $quiz, int $score): void
    {
        $this->completed_quizzes[] = $quiz->id;
        $this->experience_points += $score;
        $this->last_activity_at = now();
        $this->updateLevel();
        $this->save();
    }

    private function updateLevel(): void
    {
        $this->level = floor($this->experience_points / 1000) + 1;
        $this->next_level_points = ($this->level + 1) * 1000;
    }

    public function getLevelProgress(): float
    {
        return ($this->experience_points % 1000) / 1000 * 100;
    }

    public function getNextLevelPoints(): int
    {
        return $this->next_level_points - $this->experience_points;
    }
}
