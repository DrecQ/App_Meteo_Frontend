import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const { userId, courseId, score } = await readBody(event)

    // Validation des données
    if (!userId || !courseId || typeof score !== 'number') {
      throw createError({
        statusCode: 400,
        statusMessage: 'userId, courseId et score requis'
      })
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur non trouvé'
      })
    }

    // Vérifier que le cours existe
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Cours non trouvé'
      })
    }

    // Sauvegarder le résultat
    const quizResult = await prisma.quizResult.create({
      data: {
        userId,
        courseId,
        score
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        course: {
          select: {
            title: true
          }
        }
      }
    })

    return {
      success: true,
      message: 'Résultat sauvegardé avec succès',
      quizResult
    }

  } catch (error) {
    console.error('Erreur lors de la sauvegarde du résultat:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la sauvegarde du résultat'
    })
  }
}) 