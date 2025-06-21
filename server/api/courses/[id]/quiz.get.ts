import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const courseSlug = event.context.params?.id

  if (!courseSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug du cours manquant'
    })
  }

  try {
    // Étape 1: Trouver le cours par son slug pour obtenir son ID
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true }
    })

    if (!course) {
      throw createError({
        statusCode: 404,
        statusMessage: `Cours avec le slug '${courseSlug}' non trouvé.`
      })
    }

    // Étape 2: Trouver le quiz en utilisant l'ID du cours
    const quiz = await prisma.quiz.findUnique({
      where: {
        courseId: course.id,
      },
      include: {
        questions: {
          select: {
            id: true,
            text: true,
            options: true,
            explanation: true
          }
        },
      },
    })

    if (!quiz) {
      return {
        classicQuizExists: false,
        questions: []
      }
    }

    // On transforme les options pour ne pas révéler la bonne réponse au client
    const questionsForClient = quiz.questions.map(q => {
      // Les options sont stockées en JSON, il faut les parser
      const options = (typeof q.options === 'string' ? JSON.parse(q.options) : q.options as any[]).map(opt => ({ text: opt.text }))
      return {
        id: q.id,
        text: q.text,
        options: options,
        explanation: q.explanation
      }
    })

    return {
      id: quiz.id,
      classicQuizExists: true,
      title: quiz.title,
      questions: questionsForClient
    }

  } catch (error) {
    console.error(`Erreur lors de la récupération du quiz pour le cours ${courseSlug}:`, error)
    
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la récupération du quiz.'
    })
  }
}) 