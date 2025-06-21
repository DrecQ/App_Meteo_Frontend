import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { title, content, category, userId } = body

    if (!title || !content || !category || !userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tous les champs sont requis (title, content, category, userId)'
      })
    }

    const question = await prisma.communityQuestion.create({
      data: {
        title,
        content,
        category,
        userId,
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
      question
    }

  } catch (error) {
    console.error('Erreur lors de la création de la question:', error)
    // Renvoyer une erreur plus explicite
    if (error.code === 'P2025') {
        throw createError({
            statusCode: 404,
            statusMessage: `L'utilisateur avec l'ID '${error.meta?.cause?.userId}' n'a pas été trouvé.`
        });
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la création de la question'
    })
  }
}) 