import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Récupérer les certificats de l'utilisateur
    const certificates = await prisma.certificate.findMany({
      where: {
        userId: event.context.user.id
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
      },
      orderBy: {
        issuedAt: 'desc'
      }
    })

    // Formater les certificats pour l'affichage
    const formattedCertificates = certificates.map(cert => ({
      id: cert.id,
      title: cert.title,
      description: cert.description,
      courseTitle: cert.course?.title || 'Cours non spécifié',
      instructor: cert.course?.instructor || 'Instructeur non spécifié',
      issueDate: cert.issuedAt.toLocaleDateString('fr-FR'),
      expiryDate: cert.expiresAt ? cert.expiresAt.toLocaleDateString('fr-FR') : null,
      status: getCertificateStatus(cert.expiresAt),
      obtained: true,
      score: cert.score,
      maxScore: cert.maxScore,
      certificateUrl: cert.certificateUrl,
      createdAt: cert.createdAt,
      updatedAt: cert.updatedAt
    }))

    return {
      success: true,
      certificates: formattedCertificates
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des certificats:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
})

// Fonction pour déterminer le statut du certificat
function getCertificateStatus(expiresAt: Date | null): string {
  if (!expiresAt) return 'valid'
  
  const now = new Date()
  const expiryDate = new Date(expiresAt)
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 30) return 'expiring'
  return 'valid'
} 