import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, email, domaineActivite, phone, address } = body

    // Validation des données
    if (!name || !email || !domaineActivite) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Les champs nom, email et domaine d\'activité sont requis'
      })
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format d\'email invalide'
      })
    }

    // Vérifier si l'email existe déjà pour un autre utilisateur
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        NOT: {
          id: event.context.user?.id // Exclure l'utilisateur actuel
        }
      }
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cet email est déjà utilisé par un autre utilisateur'
      })
    }

    // Mettre à jour le profil
    const updatedUser = await prisma.user.update({
      where: {
        id: event.context.user.id
      },
      data: {
        name,
        email,
        domaineActivite,
        phone: phone || null,
        address: address || null,
        updatedAt: new Date()
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

    return {
      success: true,
      message: 'Profil mis à jour avec succès',
      user: updatedUser
    }

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
}) 