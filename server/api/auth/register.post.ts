import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const { email, password, name, domaineActivite } = await readBody(event)

    // Validation des données
    if (!email || !password || !name || !domaineActivite) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tous les champs sont requis'
      })
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Un utilisateur avec cet email existe déjà'
      })
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        domaineActivite
      },
      select: {
        id: true,
        email: true,
        name: true,
        domaineActivite: true,
        avatar: true,
        createdAt: true
      }
    })

    return {
      success: true,
      message: 'Inscription réussie',
      user
    }

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'inscription'
    })
  }
}) 