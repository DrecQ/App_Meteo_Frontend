import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // 1. Nettoyer la base de données pour un redémarrage propre
    await prisma.communityLike.deleteMany({})
    await prisma.communityAnswer.deleteMany({})
    await prisma.communityQuestion.deleteMany({})
    await prisma.certificate.deleteMany({})
    await prisma.quizResult.deleteMany({})
    await prisma.lesson.deleteMany({})
    await prisma.course.deleteMany({})
    await prisma.user.deleteMany({})
    console.log('Anciennes données nettoyées.')

    // 2. Créer des utilisateurs de test
    const salt = await bcrypt.genSalt(10)
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'kofi@example.com',
          password: await bcrypt.hash('password123', salt),
          firstName: 'Kofi',
          lastName: 'Mensah',
          role: 'user',
          avatar: '/default-avatar.svg'
        }
      }),
      prisma.user.create({
        data: {
          email: 'amina@example.com',
          password: await bcrypt.hash('password123', salt),
          firstName: 'Amina',
          lastName: 'Diallo',
          role: 'user',
          avatar: '/default-avatar.svg'
        }
      }),
      prisma.user.create({
        data: {
          email: 'jean@example.com',
          password: await bcrypt.hash('password123', salt),
          firstName: 'Jean',
          lastName: 'Adékambi',
          role: 'admin',
          avatar: '/default-avatar.svg'
        }
      }),
      prisma.user.create({
        data: {
          email: 'fatou@example.com',
          password: await bcrypt.hash('password123', salt),
          firstName: 'Fatou',
          lastName: "N'Diaye",
          role: 'user',
          avatar: '/default-avatar.svg'
        }
      })
    ])
    console.log(`${users.length} utilisateurs de test créés.`)

    // 3. Créer des cours
    const coursesData = [
       {
        slug: 'introduction-meteo',
        title: 'Introduction à la Météorologie Agricole',
        description: 'Comprendre les bases de la météo pour mieux planifier vos activités agricoles. Un cours simple et pratique pour les agriculteurs béninois.',
        instructor: 'Agence de Météo',
        duration: '45 minutes',
        lessons: [
          {
            title: "Qu'est-ce que la météorologie agricole ?",
            content: `
              <h3>La météorologie agricole, c'est quoi ?</h3>
              <p>La météorologie agricole est la science qui étudie le temps qu'il fait et comment il affecte vos cultures. C'est comme avoir un ami qui vous dit à l'avance s'il va pleuvoir ou faire soleil.</p>
              <h4>Pourquoi c'est important pour vous ?</h4>
              <ul>
                <li><strong>Planifier les semis :</strong> Savoir quand planter vos graines pour qu'elles poussent bien</li>
                <li><strong>Éviter les pertes :</strong> Protéger vos récoltes des pluies trop fortes ou de la sécheresse</li>
                <li><strong>Améliorer les rendements :</strong> Avoir de meilleures récoltes grâce à une bonne planification</li>
                <li><strong>Économiser l'eau :</strong> Arroser seulement quand c'est nécessaire</li>
              </ul>
            `
          }
        ]
      }
    ]
    
    for (const courseData of coursesData) {
      const { lessons, ...courseInfo } = courseData
      await prisma.course.create({
        data: {
          ...courseInfo,
          lessons: { create: lessons }
        }
      })
    }
    console.log(`${coursesData.length} cours créés.`)

    // 4. Créer des questions communautaires
    const communityQuestions = await Promise.all([
      prisma.communityQuestion.create({
        data: {
          title: "Comment prévoir les orages en saison sèche ?",
          content: "Je cherche à comprendre les indicateurs météorologiques qui pourraient aider à prévoir les orages même pendant la saison sèche au Bénin. Y a-t-il des signes particuliers à observer ?",
          category: "meteo",
          featured: true,
          userId: users[0].id
        }
      }),
      prisma.communityQuestion.create({
        data: {
          title: "Quels instruments pour mesurer l'humidité avec précision ?",
          content: "Quels sont les instruments les plus précis pour mesurer l'humidité relative dans un contexte de recherche climatique ? Je travaille sur un projet agricole.",
          category: "instruments",
          featured: false,
          userId: users[1].id
        }
      })
    ])
    console.log(`${communityQuestions.length} questions communautaires créées.`)

    // 5. Créer des réponses de test
    const answers = await Promise.all([
      prisma.communityAnswer.create({
        data: {
          content: "Pour prévoir les orages en saison sèche, observez les cumulonimbus qui se forment en fin d'après-midi.",
          questionId: communityQuestions[0].id,
          userId: users[1].id
        }
      })
    ])
    console.log(`${answers.length} réponses communautaires créées.`)

    // 6. Créer quelques likes de test
    await Promise.all([
      prisma.communityLike.create({ data: { userId: users[0].id, questionId: communityQuestions[1].id } }),
      prisma.communityLike.create({ data: { userId: users[1].id, answerId: answers[0].id } })
    ])
    console.log('Likes de test créés.')

    // 7. Inscrire les utilisateurs de test aux cours
    const allCourses = await prisma.course.findMany();
    if (allCourses.length > 0 && users.length > 0) {
      // Inscrire le premier utilisateur au premier cours
      await prisma.userCourse.create({
        data: {
          userId: users[0].id,
          courseId: allCourses[0].id,
          progress: 50, // Simulation d'une progression
        }
      });
      console.log(`Utilisateur ${users[0].email} inscrit au cours "${allCourses[0].title}".`);
    }

    return {
      success: true,
      message: 'Base de données peuplée avec succès',
    }

  } catch (error) {
    console.error('Erreur lors du peuplement de la base:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: `Erreur lors du peuplement de la base de données: ${error.message}`
    })
  }
}) 