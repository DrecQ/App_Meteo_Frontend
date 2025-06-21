import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: Add admin-only protection

  try {
    const questionId = event.context.params?.id

    if (!questionId) {
      throw createError({ statusCode: 400, statusMessage: 'Question ID is required' })
    }

    await prisma.question.delete({
      where: { id: questionId },
    })

    return { success: true }
  } catch (error) {
    console.error(`Error deleting question ${event.context.params?.id}:`, error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete question.' })
  }
}) 