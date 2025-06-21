import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { currentPassword, newPassword } = body

    // Validation des données
    if (!currentPassword || !newPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le mot de passe actuel et le nouveau mot de passe sont requis'
      })
    }

    if (newPassword.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le nouveau mot de passe doit contenir au moins 8 caractères'
      })
    }

    // Récupérer l'utilisateur avec son mot de passe hashé
    const user = await prisma.user.findUnique({
      where: {
        id: event.context.user.id
      },
      select: {
        id: true,
        password: true
      }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur non trouvé'
      })
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le mot de passe actuel est incorrect'
      })
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    })

    return {
      success: true,
      message: 'Mot de passe modifié avec succès'
    }

  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
}) 