<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::with(['quizzes'])->get();
        return CourseResource::collection($courses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'difficulty_level' => 'required|in:beginner,intermediate,advanced',
            'duration_minutes' => 'required|integer|min:1',
            'image_url' => 'nullable|url',
            'topics' => 'array',
            'topics.*.title' => 'required|string|max:255',
            'topics.*.description' => 'required|string',
            'topics.*.order' => 'required|integer',
            'topics.*.lessons' => 'array',
            'topics.*.lessons.*.title' => 'required|string|max:255',
            'topics.*.lessons.*.content' => 'required|string',
            'topics.*.lessons.*.order' => 'required|integer',
            'topics.*.lessons.*.duration_minutes' => 'required|integer|min:1',
            'topics.*.lessons.*.video_url' => 'nullable|url',
            'topics.*.lessons.*.additional_resources' => 'nullable|array'
        ]);

        $course = Course::create($validated);

        foreach ($validated['topics'] as $topicData) {
            $topic = $course->topics()->create($topicData);
            
            foreach ($topicData['lessons'] as $lessonData) {
                $topic->lessons()->create($lessonData);
            }
        }

        return response()->json($course->load(['topics.lessons']), 201);
    }

    public function show(Course $course)
    {
        return $course->load(['topics.lessons', 'quizzes']);
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'difficulty_level' => 'in:beginner,intermediate,advanced',
            'duration_minutes' => 'integer|min:1',
            'image_url' => 'url',
            'topics' => 'array',
            'topics.*.title' => 'string|max:255',
            'topics.*.description' => 'string',
            'topics.*.order' => 'integer',
            'topics.*.lessons' => 'array',
            'topics.*.lessons.*.title' => 'string|max:255',
            'topics.*.lessons.*.content' => 'string',
            'topics.*.lessons.*.order' => 'integer',
            'topics.*.lessons.*.duration_minutes' => 'integer|min:1',
            'topics.*.lessons.*.video_url' => 'url',
            'topics.*.lessons.*.additional_resources' => 'array'
        ]);

        $course->update($validated);

        if (isset($validated['topics'])) {
            $course->topics()->delete();
            foreach ($validated['topics'] as $topicData) {
                $topic = $course->topics()->create($topicData);
                
                if (isset($topicData['lessons'])) {
                    foreach ($topicData['lessons'] as $lessonData) {
                        $topic->lessons()->create($lessonData);
                    }
                }
            }
        }

        return response()->json($course->load(['topics.lessons']));
        return new CourseResource($course);
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return response()->noContent();
    }
}
