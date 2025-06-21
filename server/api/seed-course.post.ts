import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  try {
    const course = await prisma.course.create({
      data: {
        slug: 'secrets-du-ciel',
        title: 'Les Secrets du Ciel',
        description: 'Un voyage interactif pour comprendre les phénomènes météorologiques quotidiens',
        level: 'beginner',
        videoUrl: 'https://www.youtube.com/embed/5YpcgS3pv0I',
        quiz: {
          create: {
            title: 'Quiz: Les Secrets du Ciel',
            questions: {
              create: [
                {
                  text: 'Pourquoi le ciel est-il bleu ?',
                  options: [
                    { text: 'À cause de l\'océan', isCorrect: false },
                    { text: 'À cause de la diffusion de la lumière du soleil par l\'atmosphère', isCorrect: true },
                    { text: 'Le ciel n\'est pas bleu', isCorrect: false },
                  ],
                },
                {
                  text: 'Quel est le nuage typique d\'un orage ?',
                  options: [
                    { text: 'Cirrus', isCorrect: false },
                    { text: 'Cumulus', isCorrect: false },
                    { text: 'Cumulonimbus', isCorrect: true },
                  ],
                },
              ],
            },
          },
        },
      },
    })
    return { success: true, course }
  } catch (error: any) {
    console.error('Error seeding course:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }
}) 