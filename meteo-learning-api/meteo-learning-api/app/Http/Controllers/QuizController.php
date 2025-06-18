<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Answer;
use App\Models\Certificate;
use App\Models\Progression;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuizController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'course_id' => 'required|exists:courses,id',
            'order' => 'required|integer',
            'difficulty_level' => 'required|in:beginner,intermediate,advanced',
            'questions' => 'array',
            'questions.*.question_text' => 'required|string',
            'questions.*.question_type' => 'required|in:multiple_choice,true_false,short_answer',
            'questions.*.difficulty_level' => 'required|in:easy,medium,hard',
            'questions.*.points' => 'required|integer|min:1',
            'questions.*.explanation' => 'required|string',
            'questions.*.answers' => 'array',
            'questions.*.answers.*.answer_text' => 'required|string',
            'questions.*.answers.*.is_correct' => 'required|boolean'
        ]);

        DB::beginTransaction();
        try {
            $quiz = Quiz::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'course_id' => $validated['course_id'],
                'order' => $validated['order'],
                'difficulty_level' => $validated['difficulty_level']
            ]);

            foreach ($validated['questions'] as $questionData) {
                $question = $quiz->questions()->create($questionData);
                
                foreach ($questionData['answers'] as $answerData) {
                    $question->answers()->create($answerData);
                }
            }

            DB::commit();
            return response()->json($quiz->load(['questions.answers']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to create quiz: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'order' => 'integer',
            'difficulty_level' => 'in:beginner,intermediate,advanced',
            'questions' => 'array',
            'questions.*.question_text' => 'string',
            'questions.*.question_type' => 'in:multiple_choice,true_false,short_answer',
            'questions.*.difficulty_level' => 'in:easy,medium,hard',
            'questions.*.points' => 'integer|min:1',
            'questions.*.explanation' => 'string',
            'questions.*.answers' => 'array',
            'questions.*.answers.*.answer_text' => 'string',
            'questions.*.answers.*.is_correct' => 'boolean'
        ]);

        $quiz->update($validated);

        if (isset($validated['questions'])) {
            $quiz->questions()->delete();
            foreach ($validated['questions'] as $questionData) {
                $question = $quiz->questions()->create($questionData);
                
                if (isset($questionData['answers'])) {
                    foreach ($questionData['answers'] as $answerData) {
                        $question->answers()->create($answerData);
                    }
                }
            }
        }

        return response()->json($quiz->load(['questions.answers']));
    }

    public function destroy(Quiz $quiz)
    {
        $quiz->delete();
        return response()->noContent();
    }

    public function submitAnswer(Request $request, Quiz $quiz)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'answers' => 'required|array',
                'answers.*.question_id' => 'required|exists:questions,id',
                'answers.*.selected_answers' => 'required|array',
                'answers.*.selected_answers.*' => 'required|integer|exists:answers,id'
            ]);

            $user = $request->user();
            $score = 0;
            $correctAnswers = 0;
            $totalQuestions = count($validated['answers']);
            $userAnswers = [];

            foreach ($validated['answers'] as $answerData) {
                $question = Question::findOrFail($answerData['question_id']);
                $selectedAnswers = $answerData['selected_answers'];

                // Vérifier les réponses
                $correct = true;
                $userAnswer = [
                    'question_id' => $question->id,
                    'selected_answers' => $selectedAnswers,
                    'is_correct' => true
                ];

                foreach ($selectedAnswers as $selectedAnswer) {
                    $answer = Answer::findOrFail($selectedAnswer);
                    if (!$answer->is_correct) {
                        $correct = false;
                        $userAnswer["is_correct"] = false;
                        break;
                    }
                }

                if ($correct) {
                    $score += $question->points;
                    $correctAnswers++;
                }

                $userAnswers[] = $userAnswer;
            }

            // Mettre à jour la progression
            $progression = $user->progression;
            if (!$progression) {
                $progression = Progression::create([
                    'user_id' => $user->id,
                    'level' => 1,
                    'experience_points' => 0
                ]);
            }

            $progression->completed_quizzes = array_unique(
                array_merge($progression->completed_quizzes ?? [], [$quiz->id])
            );
            $progression->experience_points += $score;
            $progression->updateLevel();
            $progression->save();

            // Créer un certificat si c'est le dernier quiz du cours
            $course = $quiz->course;
            $nextQuiz = Quiz::where('course_id', $course->id)
                ->where('order', '>', $quiz->order)
                ->orderBy('order')
                ->first();

            $certificate = null;
            if (!$nextQuiz) {
                $certificate = Certificate::create([
                    'user_id' => $user->id,
                    'course_id' => $course->id,
                    'score' => $score,
                    'level' => $progression->level,
                    'total_points' => $progression->experience_points
                ]);
                $certificate->generateCertificate();
            }

            DB::commit();

            return response()->json([
                'score' => $score,
                'correct_answers' => $correctAnswers,
                'total_questions' => $totalQuestions,
                'progression' => $progression->load('user'),
                'certificate' => $nextQuiz ? null : $certificate,
                'user_answers' => $userAnswers
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to submit quiz answers: ' . $e->getMessage()
            ], 500);
        }
    }
}
