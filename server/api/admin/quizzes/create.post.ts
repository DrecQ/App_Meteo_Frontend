import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: Add admin-only protection

  try {
    const body = await readBody(event)
    const { title, type, courseId } = body

    if (!title || !type || !courseId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title, type, and courseId are required',
      })
    }

    const newQuiz = await prisma.quiz.create({
      data: {
        title,
        type,
        courseId,
      },
    })

    return newQuiz
  } catch (error) {
    console.error('Error creating quiz:', error)
    if (error.code === 'P2002') { // Erreur de contrainte unique
        throw createError({
            statusCode: 409,
            statusMessage: 'A quiz already exists for this course. Each course can only have one quiz.',
        })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create quiz.',
    })
  }
}) 