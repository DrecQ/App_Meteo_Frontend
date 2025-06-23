import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const userCount = await prisma.user.count()
    const newUsersCount = await prisma.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    })
    const courseCount = await prisma.course.count()
    const quizResultCount = await prisma.quizResult.count()
    
    // Calcul du taux de réussite moyen. On considère un quiz réussi si le score est > 50%
    const successfulQuizzes = await prisma.quizResult.findMany({
      select: { score: true, maxScore: true }
    })
    const successRate = successfulQuizzes.length > 0
      ? (successfulQuizzes.filter(q => q.score > q.maxScore / 2).length / successfulQuizzes.length) * 100
      : 0

    // Calcul de la complétion moyenne des cours
    const averageCompletion = await prisma.userCourse.aggregate({
      _avg: {
        progress: true,
      },
    })
    
    return {
      userCount,
      newUsersCount,
      courseCount,
      quizResultCount,
      averageCompletion: averageCompletion._avg.progress?.toFixed(0) || 0,
      successRate: successRate.toFixed(0)
    }
  } catch (error) {
    console.error('Error fetching detailed stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
}) 