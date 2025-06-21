import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { userId, questionId, answerId } = body

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'userId est requis'
      })
    }

    // Vérifier si l'utilisateur a déjà liké
    const existingLike = await prisma.communityLike.findFirst({
      where: {
        userId: userId,
        ...(questionId && { questionId: questionId }),
        ...(answerId && { answerId: answerId })
      }
    })

    if (existingLike) {
      // Supprimer le like existant (unlike)
      await prisma.communityLike.delete({
        where: {
          id: existingLike.id
        }
      })

      return {
        success: true,
        action: 'unliked'
      }
    } else {
      // Créer un nouveau like
      await prisma.communityLike.create({
        data: {
          userId: userId,
          ...(questionId && { questionId: questionId }),
          ...(answerId && { answerId: answerId }),
          createdAt: new Date()
        }
      })

      return {
        success: true,
        action: 'liked'
      }
    }

  } catch (error) {
    console.error('Erreur lors du like/unlike:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors du like/unlike'
    })
  }
}) 