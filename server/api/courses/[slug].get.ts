import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug du cours requis'
      })
    }

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        lessons: true,
        _count: {
          select: {
            users: true
          }
        }
      }
    })

    if (!course) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Cours non trouvé'
      })
    }

    return {
      success: true,
      course
    }

  } catch (error) {
    console.error('Erreur lors de la récupération du cours:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération du cours'
    })
  }
}) 