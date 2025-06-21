import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: Add admin-only protection

  try {
    const questionId = event.context.params?.id;
    const body = await readBody(event)
    const { text, options, explanation } = body

    if (!questionId) {
        throw createError({ statusCode: 400, statusMessage: 'Question ID is required.' });
    }
    if (!text || !options || !Array.isArray(options) || options.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'Text and at least one option are required.' });
    }
     if (!options.some(opt => opt.isCorrect)) {
        throw createError({ statusCode: 400, statusMessage: 'At least one option must be marked as correct.' });
    }

    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        text,
        options,
        explanation,
      },
    })

    return updatedQuestion
  } catch (error) {
    console.error(`Error updating question ${event.context.params?.id}:`, error)
    if(error.statusCode) throw error;
    throw createError({ statusCode: 500, statusMessage: 'Failed to update question.' })
  }
}) 