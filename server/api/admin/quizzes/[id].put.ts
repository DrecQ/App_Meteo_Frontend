import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: Add admin-only protection

  try {
    const quizId = event.context.params?.id
    const body = await readBody(event)
    const { title, type } = body

    if (!quizId) {
      throw createError({ statusCode: 400, statusMessage: 'Quiz ID is required' })
    }
    if (!title || !type) {
      throw createError({ statusCode: 400, statusMessage: 'Title and type are required' })
    }

    const updatedQuiz = await prisma.quiz.update({
      where: { id: quizId },
      data: { title, type },
    })

    return updatedQuiz
  } catch (error) {
    console.error(`Error updating quiz ${event.context.params?.id}:`, error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to update quiz.' })
  }
}) 