import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: Add admin-only protection

  try {
    const quizId = event.context.params?.id

    if (!quizId) {
      throw createError({ statusCode: 400, statusMessage: 'Quiz ID is required' })
    }

    // Grâce à 'onDelete: Cascade' dans le schéma, la suppression de ce quiz
    // entraînera la suppression de toutes les questions associées.
    await prisma.quiz.delete({
      where: { id: quizId },
    })

    return { success: true }
  } catch (error) {
    console.error(`Error deleting quiz ${event.context.params?.id}:`, error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete quiz.' })
  }
}) 