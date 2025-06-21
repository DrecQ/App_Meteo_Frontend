import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { quizId, answers } = await readBody(event)

  if (!quizId || !answers) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID du quiz ou réponses manquantes',
    })
  }

  try {
    const questions = await prisma.question.findMany({
      where: { quizId: quizId },
      select: { id: true, text: true, options: true, explanation: true },
    })

    let score = 0
    const results = []

    for (const q of questions) {
      const userAnswer = answers.find(a => a.questionId === q.id)
      const options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      const correctAnswerIndex = options.findIndex(opt => opt.isCorrect)
      
      const isCorrect = userAnswer && userAnswer.answerIndex === correctAnswerIndex

      if (isCorrect) {
        score++
      }

      results.push({
        questionId: q.id,
        questionText: q.text,
        userAnswerIndex: userAnswer ? userAnswer.answerIndex : null,
        correctAnswerIndex: correctAnswerIndex,
        isCorrect: isCorrect,
        explanation: q.explanation,
        options: options.map(o => o.text)
      })
    }
    
    // TODO: Sauvegarder le résultat dans la table QuizResult

    return {
      score,
      totalQuestions: questions.length,
      results,
    }
  } catch (error) {
    console.error('Erreur lors de la soumission du quiz classique:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la soumission du quiz.',
    })
  }
}) 