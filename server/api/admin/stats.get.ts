import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: Ajouter une vérification pour s'assurer que seul un admin peut accéder à cette route.

  try {
    const userCount = await prisma.user.count()
    const courseCount = await prisma.course.count()
    const quizCount = await prisma.quiz.count()
    const questionCount = await prisma.communityQuestion.count()

    return {
      userCount,
      courseCount,
      quizCount,
      questionCount,
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques admin:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la récupération des statistiques.',
    })
  }
}) 