import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: Add admin-only protection

  try {
    const body = await readBody(event)
    const { quizId, text, options, explanation } = body

    if (!quizId || !text || !options || !Array.isArray(options) || options.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Quiz ID, text, and at least one option are required.',
      })
    }
    
    // Vérifier qu'au moins une option est correcte
    const hasCorrectOption = options.some(opt => opt.isCorrect);
    if (!hasCorrectOption) {
        throw createError({
            statusCode: 400,
            statusMessage: 'At least one option must be marked as correct.',
        });
    }

    const newQuestion = await prisma.question.create({
      data: {
        quizId,
        text,
        options, // Prisma gère la sérialisation JSON
        explanation,
      },
    })

    return newQuestion
  } catch (error) {
    console.error('Error creating question:', error)
    if(error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create question.',
    })
  }
}) 