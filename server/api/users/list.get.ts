import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        domaineActivite: true,
        createdAt: true,
        _count: {
          select: {
            courses: true,
            quizzes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      users,
      total: users.length
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des utilisateurs'
    })
  }
}) 