import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: Add admin-only protection

  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { 
            quizzes: true,
            enrollments: true 
          },
        },
        teacher: {
            select: {
                name: true
            }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return courses.map(course => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      teacherName: course.teacher?.name || 'N/A',
      quizCount: course._count.quizzes,
      studentCount: course._count.enrollments,
      createdAt: course.createdAt,
      published: course.published,
      imageUrl: course.imageUrl // Assurez-vous que ce champ existe et a une valeur
    }))
  } catch (error) {
    console.error('Error fetching courses list for admin:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch courses.',
    })
  }
}) 