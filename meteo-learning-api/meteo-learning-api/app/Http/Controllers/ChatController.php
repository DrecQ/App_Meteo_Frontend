<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChatMessageResource;
use App\Models\ChatMessage;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index()
    {
        $messages = ChatMessage::with('user')->latest()->get();
        return ChatMessageResource::collection($messages);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000'
        ]);

        $message = ChatMessage::create([
            'user_id' => $request->user()->id,
            'content' => $validated['content']
        ]);

        return new ChatMessageResource($message);
    }

    public function like(ChatMessage $message)
    {
        $message->increment('likes');
        return new ChatMessageResource($message);
    }

    public function delete(ChatMessage $message)
    {
        $this->authorize('delete', $message);
        $message->delete();
        return response()->noContent();
    }
}
