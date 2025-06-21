import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { category, answered, featured, search } = query

    let whereClause: any = {}

    // Filtres
    if (category) {
      whereClause.category = category
    }

    if (answered !== undefined) {
      whereClause.answered = answered === 'true'
    }

    if (featured !== undefined) {
      whereClause.featured = featured === 'true'
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } }
      ]
    }

    const questions = await prisma.communityQuestion.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        },
        answers: {
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
        },
        likes: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Compter les réponses et likes pour chaque question
    const questionsWithStats = questions.map(question => ({
      ...question,
      answersCount: question.answers.length,
      likesCount: question.likes.length,
      answered: question.answers.length > 0
    }))

    return {
      success: true,
      questions: questionsWithStats
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des questions:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des questions'
    })
  }
}) 