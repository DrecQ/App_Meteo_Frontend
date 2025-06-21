import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Vérifier si c'est une route API qui nécessite une authentification
  const url = getRequestURL(event)
  const isUserRoute = url.pathname.startsWith('/api/user/')
  const isQuizRoute = url.pathname.startsWith('/api/quiz-ia-stream')

  if (!isUserRoute && !isQuizRoute) {
    return
  }

  try {
    // Récupérer le token depuis les headers
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token d\'authentification manquant'
      })
    }

    const token = authHeader.substring(7) // Enlever "Bearer "

    // Vérifier le token (pour l'instant, on utilise un token fictif)
    if (token !== 'fake-jwt-token') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token d\'authentification invalide'
      })
    }

    // Récupérer l'email de l'utilisateur depuis les headers
    const userEmail = getHeader(event, 'x-user-email')
    
    if (!userEmail) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email utilisateur manquant'
      })
    }
    
    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail
      },
      select: {
        id: true,
        name: true,
        email: true,
        domaineActivite: true,
        phone: true,
        address: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Utilisateur non trouvé'
      })
    }

    // Ajouter l'utilisateur au contexte
    event.context.user = user

  } catch (error) {
    console.error('Erreur middleware authentification:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 401,
      statusMessage: 'Non autorisé'
    })
  }
}) 