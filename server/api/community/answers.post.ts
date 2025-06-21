import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { content, questionId, userId } = body

    if (!content || !questionId || !userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tous les champs sont requis'
      })
    }

    const answer = await prisma.communityAnswer.create({
      data: {
        content,
        questionId: questionId,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        }
      }
    })

    return {
      success: true,
      answer
    }

  } catch (error) {
    console.error('Erreur lors de la création de la réponse:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la création de la réponse'
    })
  }
}) 