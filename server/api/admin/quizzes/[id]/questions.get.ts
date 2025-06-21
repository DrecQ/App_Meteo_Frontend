import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: Add admin-only protection

  const quizId = event.context.params?.id

  if (!quizId) {
    throw createError({ statusCode: 400, statusMessage: 'Quiz ID is required' })
  }

  try {
    const quizWithQuestions = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: {
          select: { id: true, title: true }
        },
        questions: {
          orderBy: {
            // On peut trier par ordre de création ou autre critère plus tard
            id: 'asc' 
          }
        }
      }
    });

    if (!quizWithQuestions) {
      throw createError({ statusCode: 404, statusMessage: 'Quiz not found' })
    }

    return quizWithQuestions;

  } catch (error) {
    console.error(`Error fetching questions for quiz ${quizId}:`, error)
    if (error.statusCode) throw error;
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch questions.' })
  }
}) 