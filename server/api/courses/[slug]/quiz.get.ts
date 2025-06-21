import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    })
  }

  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        quizzes: {
          where: { type: 'CLASSIC' },
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    })

    if (!course) {
      throw createError({
        statusCode: 404,
        statusMessage: `Course with slug '${slug}' not found`,
      })
    }

    // On suppose qu'il n'y a qu'un seul quiz classique par cours
    const classicQuiz = course.quizzes[0]

    if (!classicQuiz) {
      return null // Ou une erreur si un quiz est toujours attendu
    }

    return {
      id: classicQuiz.id,
      title: classicQuiz.title,
      questions: classicQuiz.questions.map(q => ({
        id: q.id,
        text: q.text,
        options: q.options.map(o => ({
          id: o.id,
          text: o.text,
          isCorrect: o.isCorrect,
        })),
      })),
    }
  } catch (error) {
    console.error('Error fetching classic quiz:', error)
    // Renvoyer une erreur plus générique pour ne pas exposer les détails de l'implémentation
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
}) 