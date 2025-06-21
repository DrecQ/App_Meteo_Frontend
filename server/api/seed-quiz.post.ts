import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // NOTE: Cet endpoint est uniquement pour le développement.
  // Il devrait être désactivé ou protégé en production.
  
  const courseIdToSeed = 'introduction-meteo'
  const courseSlug = 'introduction-meteo'

  try {
    // Étape 1: S'assurer que le cours existe
    let course = await prisma.course.findUnique({
      where: { slug: courseSlug },
    });

    if (!course) {
      course = await prisma.course.create({
        data: {
          slug: courseSlug,
          title: 'Introduction à la Météorologie',
          description: 'Apprenez les bases de la météorologie et du climat.',
          instructor: 'Agence Météo',
          duration: '30 minutes',
          level: 'beginner',
          category: 'meteo',
        },
      });
      console.log(`Cours '${course.title}' créé.`);
    }

    // Étape 2: Vérifier si un quiz existe déjà pour ce cours
    const existingQuiz = await prisma.quiz.findUnique({
      where: { courseId: course.id },
    })

    if (existingQuiz) {
      return { message: 'Un quiz existe déjà pour ce cours. Aucune action effectuée.' }
    }

    // Créer un nouveau quiz
    const quiz = await prisma.quiz.create({
      data: {
        title: 'Quiz de base sur la Météorologie',
        courseId: course.id,
        questions: {
          create: [
            {
              text: 'Quelle est la principale cause des vents ?',
              explanation: "Les vents sont causés par les différences de pression atmosphérique, l'air se déplaçant des zones de haute pression vers les zones de basse pression.",
              options: [
                { "text": "La rotation de la Terre", "isCorrect": false },
                { "text": "Les différences de pression atmosphérique", "isCorrect": true },
                { "text": "L'attraction de la lune", "isCorrect": false },
                { "text": "Les éruptions solaires", "isCorrect": false }
              ],
            },
            {
              text: 'Quel instrument mesure la vitesse du vent ?',
              explanation: "Un anémomètre est l'instrument utilisé pour mesurer la vitesse du vent.",
              options: [
                { "text": "Un baromètre", "isCorrect": false },
                { "text": "Un hygromètre", "isCorrect": false },
                { "text": "Un anémomètre", "isCorrect": true },
                { "text": "Un thermomètre", "isCorrect": false }
              ],
            },
            {
              text: 'Que signifie un cumulonimbus dans le ciel ?',
              explanation: "Le cumulonimbus est un nuage d'orage, souvent associé à de fortes pluies, des éclairs et du tonnerre.",
              options: [
                { "text": "Un temps calme et ensoleillé", "isCorrect": false },
                { "text": "Une légère brise", "isCorrect": false },
                { "text": "Un risque d'orage", "isCorrect": true },
                { "text": "Du brouillard imminent", "isCorrect": false }
              ],
            },
          ],
        },
      },
    })

    return {
      message: 'Quiz créé avec succès !',
      quiz,
    }
  } catch (error) {
    console.error('Erreur lors du seeding du quiz:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la création du quiz de test.',
    })
  }
}) 