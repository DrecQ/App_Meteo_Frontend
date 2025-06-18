<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'score',
        'completed_at',
        'certificate_url',
        'level',
        'total_points',
        'valid_until'
    ];

    protected $casts = [
        'completed_at' => 'datetime',
        'valid_until' => 'datetime',
        'level' => 'integer',
        'total_points' => 'integer'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function generateCertificateUrl(): string
    {
        // Générer un URL unique pour le certificat
        $id = $this->id;
        $timestamp = $this->completed_at->format('Y-m-d');
        $hash = hash('sha256', $id . $timestamp . config('app.key'));
        
        return route('certificates.show', [
            'id' => $id,
            'hash' => $hash
        ]);
    }

    public function generateCertificate(): void
    {
        $this->certificate_url = $this->generateCertificateUrl();
        $this->valid_until = now()->addYears(1);
        $this->save();
    }

    public function isValid(): bool
    {
        return $this->valid_until > now();
    }

    public function getProgression(): float
    {
        return ($this->score / 100) * 100;
    }
}
