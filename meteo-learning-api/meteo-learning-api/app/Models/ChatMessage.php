<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = [
        'user_id',
        'content',
        'likes'
    ];

    /**
     * Get the user that posted the message.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
