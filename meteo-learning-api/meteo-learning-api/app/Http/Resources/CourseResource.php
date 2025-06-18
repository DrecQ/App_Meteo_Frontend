<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'category' => $this->category,
            'language' => $this->language,
            'file_path' => $this->file_path,
            'quizzes' => QuizResource::collection($this->quizzes),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
