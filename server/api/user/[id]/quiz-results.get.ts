import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'id')

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID utilisateur requis'
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

    // Récupérer les résultats de quiz
    const quizResults = await prisma.quizResult.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            title: true,
            slug: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Calculer les statistiques
    const totalQuizzes = quizResults.length
    const averageScore = totalQuizzes > 0 
      ? quizResults.reduce((sum, result) => sum + result.score, 0) / totalQuizzes 
      : 0
    const bestScore = totalQuizzes > 0 
      ? Math.max(...quizResults.map(result => result.score))
      : 0

    return {
      success: true,
      quizResults,
      stats: {
        totalQuizzes,
        averageScore: Math.round(averageScore * 10) / 10,
        bestScore
      }
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des résultats:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des résultats'
    })
  }
}) 