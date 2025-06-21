import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const { userId, courseId, score, maxScore = 5 } = await readBody(event)

    // Validation des données
    if (!userId || !courseId || typeof score !== 'number') {
      throw createError({
        statusCode: 400,
        statusMessage: 'userId, courseId et score requis'
      })
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur non trouvé'
      })
    }

    // Vérifier que le cours existe
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Cours non trouvé'
      })
    }

    // Sauvegarder le résultat
    const quizResult = await prisma.quizResult.create({
      data: {
        userId,
        courseId,
        score
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        course: {
          select: {
            title: true
          }
        }
      }
    })

    // Vérifier si l'utilisateur mérite un certificat (score >= 70%)
    const percentage = (score / maxScore) * 100
    let certificate = null

    if (percentage >= 70) {
      // Vérifier si un certificat existe déjà pour ce cours
      const existingCertificate = await prisma.certificate.findFirst({
        where: {
          userId: userId,
          courseId: courseId
        }
      })

      if (!existingCertificate) {
        // Créer un certificat
        const issuedAt = new Date()
        const expiresAt = new Date()
        expiresAt.setFullYear(expiresAt.getFullYear() + 3)

        certificate = await prisma.certificate.create({
          data: {
            userId: userId,
            courseId: courseId,
            title: `Certificat de réussite - ${course.title}`,
            description: `Certificat de réussite pour le cours "${course.title}" avec un score de ${score}/${maxScore} (${percentage.toFixed(1)}%)`,
            score: score,
            maxScore: maxScore,
            issuedAt: issuedAt,
            expiresAt: expiresAt,
            certificateUrl: null,
            status: 'active'
          }
        })
      }
    }

    return {
      success: true,
      message: 'Résultat sauvegardé avec succès',
      quizResult,
      certificate: certificate ? {
        id: certificate.id,
        title: certificate.title,
        description: certificate.description,
        score: certificate.score,
        maxScore: certificate.maxScore,
        percentage: percentage
      } : null,
      earnedCertificate: !!certificate
    }

  } catch (error) {
    console.error('Erreur lors de la sauvegarde du résultat:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la sauvegarde du résultat'
    })
  }
}) 