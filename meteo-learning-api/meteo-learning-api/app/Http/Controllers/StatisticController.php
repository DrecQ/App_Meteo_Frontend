<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Statistic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'type' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'limit' => 'integer|min:1|max:100'
        ]);

        $query = Statistic::query();

        if ($validated['user_id']) {
            $query->where('user_id', $validated['user_id']);
        }

        if ($validated['type']) {
            $query->where('type', $validated['type']);
        }

        if ($validated['start_date']) {
            $query->where('created_at', '>=', $validated['start_date']);
        }

        if ($validated['end_date']) {
            $query->where('created_at', '<=', $validated['end_date']);
        }

        $statistics = $query->orderBy('created_at', 'desc')
            ->limit($validated['limit'] ?? 50)
            ->get();

        return response()->json($statistics);
    }

    public function getCourseStats(Request $request, $courseId)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date'
        ]);

        $query = Statistic::whereHas('course', function($q) use ($courseId) {
            $q->where('id', $courseId);
        });

        if ($validated['user_id']) {
            $query->where('user_id', $validated['user_id']);
        }

        if ($validated['start_date']) {
            $query->where('created_at', '>=', $validated['start_date']);
        }

        if ($validated['end_date']) {
            $query->where('created_at', '<=', $validated['end_date']);
        }

        $stats = $query->get();

        return response()->json([
            'course_id' => $courseId,
            'total_users' => $stats->pluck('user_id')->unique()->count(),
            'average_score' => $stats->avg('value'),
            'highest_score' => $stats->max('value'),
            'lowest_score' => $stats->min('value'),
            'stats' => $stats
        ]);
    }

    public function getUserStats(Request $request)
    {
        $user = $request->user();

        $stats = [
            'total_courses' => $user->courses()->count(),
            'completed_courses' => $user->courses()->wherePivot('completed_at', '!=', null)->count(),
            'total_lessons' => $user->courses()->withCount('lessons')->sum('lessons_count'),
            'completed_lessons' => $user->progression?->completed_lessons?->count() ?? 0,
            'total_quizzes' => $user->courses()->withCount('quizzes')->sum('quizzes_count'),
            'completed_quizzes' => $user->progression?->completed_quizzes?->count() ?? 0,
            'level' => $user->progression?->level ?? 1,
            'experience_points' => $user->progression?->experience_points ?? 0,
            'next_level_points' => $user->progression?->next_level_points ?? 1000,
            'certificates' => $user->certificates()->count(),
            'recent_activity' => $user->courses()->withPivot('completed_at')
                ->wherePivot('completed_at', '!=', null)
                ->orderBy('pivot_completed_at', 'desc')
                ->limit(5)
                ->get()
        ];

        return response()->json($stats);
    }

    public function getLeaderboard(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:experience_points,total_courses,completed_courses',
            'limit' => 'integer|min:1|max:100',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date'
        ]);

        $query = DB::table('users')
            ->leftJoin('progressions', 'users.id', '=', 'progressions.user_id')
            ->select('users.*',
                'progressions.level',
                'progressions.experience_points',
                DB::raw('COUNT(DISTINCT courses_user.course_id) as total_courses'),
                DB::raw('COUNT(DISTINCT CASE WHEN courses_user.completed_at IS NOT NULL THEN courses_user.course_id END) as completed_courses')
            )
            ->leftJoin('courses_user', 'users.id', '=', 'courses_user.user_id');

        if ($validated['start_date']) {
            $query->where('courses_user.completed_at', '>=', $validated['start_date']);
        }

        if ($validated['end_date']) {
            $query->where('courses_user.completed_at', '<=', $validated['end_date']);
        }

        $query->groupBy('users.id')
            ->orderBy($validated['type'], 'desc')
            ->limit($validated['limit'] ?? 10);

        $leaderboard = $query->get();

        return response()->json($leaderboard);
    }
}
