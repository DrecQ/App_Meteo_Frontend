import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        lessons: true,
        _count: {
          select: {
            users: true
          }
        }
      }
    })

    return {
      success: true,
      courses
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des cours'
    })
  }
}) 