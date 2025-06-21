import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Données des cours existants
    const coursesData = [
      {
        slug: 'introduction-meteo',
        title: 'Introduction à la Météorologie',
        description: 'Découvrez les bases de la météorologie. Un cours gratuit pour comprendre les phénomènes météorologiques quotidiens.',
        instructor: 'Dr. Jean Dupont',
        duration: '20 minutes',
        lessons: [
          {
            title: 'Les Bases de la Météorologie',
            content: `
              <h3>Qu'est-ce que la météorologie ?</h3>
              <p>La météorologie est la science qui étudie les phénomènes atmosphériques et les prévisions du temps.</p>
              
              <h4>Points clés à retenir</h4>
              <ul>
                <li>Définition de la météorologie</li>
                <li>Importance des prévisions météo</li>
                <li>Instruments de base</li>
              </ul>
            `,
            duration: '10 min'
          },
          {
            title: 'Lire une Carte Météo',
            content: `
              <h3>Comprendre les symboles météo</h3>
              <p>Apprenez à décoder les symboles et les informations sur une carte météorologique.</p>
            `,
            duration: '10 min'
          }
        ]
      },
      {
        slug: 'secrets-du-ciel',
        title: 'Les Secrets du Ciel',
        description: 'Découvrez les mystères du ciel bleu et des nuages. Comprendre pourquoi le ciel est bleu et comment se forment les différents types de nuages.',
        instructor: 'Dr. Marie Dubois',
        duration: '30 minutes',
        lessons: [
          {
            title: 'Le Mystère du Ciel Bleu',
            content: `
              <h3>Pourquoi le ciel est-il bleu ?</h3>
              <p>Le ciel nous apparaît bleu à cause d'un phénomène appelé diffusion de Rayleigh. La lumière du soleil, qui est blanche, est composée de toutes les couleurs de l'arc-en-ciel.</p>
              
              <h4>Points clés à retenir</h4>
              <ul>
                <li>La lumière du soleil est blanche</li>
                <li>Les molécules de l'air diffusent la lumière</li>
                <li>La couleur bleue est plus diffusée que les autres</li>
              </ul>
            `,
            duration: '15 min'
          },
          {
            title: 'Les Nuages et leurs Formes',
            content: `
              <h3>Les différents types de nuages</h3>
              <p>Les nuages sont classés selon leur forme et leur altitude. Chaque type de nuage nous donne des informations sur le temps qu'il va faire.</p>
            `,
            duration: '15 min'
          }
        ]
      },
      {
        slug: 'instruments-meteo',
        title: 'Les Instruments Météo',
        description: 'Apprenez à utiliser les instruments météorologiques essentiels. Du thermomètre à l\'anémomètre, maîtrisez les outils de mesure du temps.',
        instructor: 'Prof. Pierre Martin',
        duration: '45 minutes',
        lessons: [
          {
            title: 'Le Thermomètre',
            content: `
              <h3>Comment fonctionne un thermomètre ?</h3>
              <p>Le thermomètre est l'instrument le plus connu pour mesurer la température. Découvrez son fonctionnement et son histoire.</p>
            `,
            duration: '20 min'
          },
          {
            title: 'L\'Anémomètre',
            content: `
              <h3>Mesurer la vitesse du vent</h3>
              <p>L'anémomètre est l'instrument qui nous permet de mesurer la vitesse du vent. Apprenez à l'utiliser et à interpréter ses mesures.</p>
            `,
            duration: '25 min'
          }
        ]
      },
      {
        slug: 'saisons',
        title: 'Les Saisons',
        description: 'Explorez les caractéristiques météorologiques de chaque saison. Comprendre les changements climatiques et leurs impacts sur la nature.',
        instructor: 'Dr. Sophie Bernard',
        duration: '40 minutes',
        lessons: [
          {
            title: 'Le Printemps',
            content: `
              <h3>Le réveil de la nature</h3>
              <p>Le printemps est la saison du renouveau. Découvrez les changements météorologiques qui caractérisent cette période.</p>
            `,
            duration: '10 min'
          },
          {
            title: 'L\'Été',
            content: `
              <h3>Les journées ensoleillées</h3>
              <p>L'été est la saison la plus chaude. Apprenez à comprendre les phénomènes météorologiques estivaux.</p>
            `,
            duration: '10 min'
          },
          {
            title: 'L\'Automne',
            content: `
              <h3>Les couleurs de l'automne</h3>
              <p>L'automne est la saison des changements. Découvrez les particularités météorologiques de cette période.</p>
            `,
            duration: '10 min'
          },
          {
            title: 'L\'Hiver',
            content: `
              <h3>Le froid et la neige</h3>
              <p>L'hiver est la saison la plus froide. Apprenez à comprendre les phénomènes météorologiques hivernaux.</p>
            `,
            duration: '10 min'
          }
        ]
      },
      {
        slug: 'phenomenes-meteo',
        title: 'Les Phénomènes Météo',
        description: 'Découvrez les phénomènes météorologiques fascinants. Des orages aux arc-en-ciel, explorez la magie de la météo.',
        instructor: 'Dr. Thomas Leroy',
        duration: '50 minutes',
        lessons: [
          {
            title: 'Les Orages',
            content: `
              <h3>Comprendre les orages</h3>
              <p>Les orages sont des phénomènes météorologiques spectaculaires. Découvrez leur formation et leurs caractéristiques.</p>
            `,
            duration: '15 min'
          },
          {
            title: 'Les Arc-en-ciel',
            content: `
              <h3>La magie des arc-en-ciel</h3>
              <p>Les arc-en-ciel sont de magnifiques phénomènes optiques. Apprenez comment ils se forment et pourquoi nous voyons leurs couleurs.</p>
            `,
            duration: '15 min'
          },
          {
            title: 'La Neige',
            content: `
              <h3>La formation de la neige</h3>
              <p>La neige est un phénomène météorologique fascinant. Découvrez comment se forment les flocons et pourquoi chaque flocon est unique.</p>
            `,
            duration: '20 min'
          }
        ]
      }
    ]

    // Créer les cours et leurs leçons
    for (const courseData of coursesData) {
      const { lessons, ...courseInfo } = courseData
      
      const course = await prisma.course.create({
        data: {
          ...courseInfo,
          lessons: {
            create: lessons
          }
        }
      })
      
      console.log(`Cours créé: ${course.title}`)
    }

    return {
      success: true,
      message: 'Base de données peuplée avec succès',
      coursesCreated: coursesData.length
    }

  } catch (error) {
    console.error('Erreur lors du peuplement de la base:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors du peuplement de la base de données'
    })
  }
}) 