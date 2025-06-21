import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: Add admin-only protection

  try {
    const courseId = event.context.params?.id
    const body = await readBody(event)

    const {
      title,
      slug,
      description,
      teacherId,
      imageUrl,
      published
    } = body

    if (!courseId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Course ID is required',
        })
    }

    // Validation simple
    if (!title || !slug || !teacherId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title, slug, and teacherId are required',
      })
    }

    // Vérifier si un autre cours utilise déjà le nouveau slug
    const existingCourseWithSlug = await prisma.course.findFirst({
        where: {
            slug: slug,
            id: { not: courseId }
        }
    });

    if (existingCourseWithSlug) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Another course with this slug already exists.'
        });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        slug,
        description,
        teacherId,
        imageUrl,
        published,
      },
    })

    return updatedCourse
  } catch (error) {
    console.error(`Error updating course ${event.context.params?.id}:`, error)
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update course.',
    })
  }
}) 