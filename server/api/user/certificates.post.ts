import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { courseId, score, maxScore, title, description } = body

    // Validation des données
    if (!courseId || !score || !maxScore || !title) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Les champs courseId, score, maxScore et title sont requis'
      })
    }

    // Vérifier que l'utilisateur a suivi le cours
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: {
        userId: event.context.user.id,
        courseId: courseId,
        status: 'completed'
      }
    })

    if (!enrollment) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Vous devez avoir complété le cours pour obtenir un certificat'
      })
    }

    // Vérifier si un certificat existe déjà pour ce cours
    const existingCertificate = await prisma.certificate.findFirst({
      where: {
        userId: event.context.user.id,
        courseId: courseId
      }
    })

    if (existingCertificate) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Vous avez déjà un certificat pour ce cours'
      })
    }

    // Calculer la date d'expiration (3 ans par défaut)
    const issuedAt = new Date()
    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 3)

    // Créer le certificat
    const certificate = await prisma.certificate.create({
      data: {
        userId: event.context.user.id,
        courseId: courseId,
        title: title,
        description: description || `Certificat de réussite pour ${title}`,
        score: score,
        maxScore: maxScore,
        issuedAt: issuedAt,
        expiresAt: expiresAt,
        certificateUrl: null, // À générer plus tard si nécessaire
        status: 'active'
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            instructor: true
          }
        }
      }
    })

    // Formater la réponse
    const formattedCertificate = {
      id: certificate.id,
      title: certificate.title,
      description: certificate.description,
      courseTitle: certificate.course?.title || 'Cours non spécifié',
      instructor: certificate.course?.instructor || 'Instructeur non spécifié',
      issueDate: certificate.issuedAt.toLocaleDateString('fr-FR'),
      expiryDate: certificate.expiresAt ? certificate.expiresAt.toLocaleDateString('fr-FR') : null,
      status: 'valid',
      obtained: true,
      score: certificate.score,
      maxScore: certificate.maxScore,
      certificateUrl: certificate.certificateUrl,
      createdAt: certificate.createdAt,
      updatedAt: certificate.updatedAt
    }

    return {
      success: true,
      message: 'Certificat généré avec succès',
      certificate: formattedCertificate
    }

  } catch (error) {
    console.error('Erreur lors de la génération du certificat:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
}) 