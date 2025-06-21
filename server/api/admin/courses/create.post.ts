import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: Add admin-only protection

  try {
    const body = await readBody(event)

    const {
      title,
      slug,
      description,
      teacherId,
      imageUrl,
      published
    } = body

    // Validation simple
    if (!title || !slug || !teacherId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title, slug, and teacherId are required',
      })
    }

    // Vérifier si le slug existe déjà
    const existingCourse = await prisma.course.findUnique({
      where: { slug },
    })

    if (existingCourse) {
      throw createError({
        statusCode: 409, // Conflict
        statusMessage: 'A course with this slug already exists.',
      })
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        teacherId,
        imageUrl,
        published,
      },
    })

    return newCourse
  } catch (error) {
    console.error('Error creating course:', error)
     if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create course.',
    })
  }
}) 