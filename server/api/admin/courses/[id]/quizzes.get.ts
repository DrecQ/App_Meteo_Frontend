import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: Add admin-only protection

  const courseId = event.context.params?.id

  if (!courseId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Course ID is required',
    })
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        quizzes: {
          select: {
            id: true,
            title: true,
            type: true,
            _count: {
              select: { questions: true }
            }
          },
          orderBy: {
            title: 'asc'
          }
        }
      }
    });

    if (!course) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Course not found',
      })
    }

    return course;

  } catch (error) {
    console.error(`Error fetching quizzes for course ${courseId}:`, error)
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch quizzes.',
    })
  }
}) 