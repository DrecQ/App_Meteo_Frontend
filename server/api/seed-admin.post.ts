import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // ATTENTION: Ce endpoint ne devrait pas être exposé en production.
  // Idéalement, utilisez les "seed scripts" de Prisma pour cela.
  // Ceci est une méthode rapide pour le développement.

  const adminEmail = 'admin@meteo.app'
  const adminPassword = 'password'

  try {
    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (existingAdmin) {
      return {
        statusCode: 200,
        message: 'Admin user already exists.',
        user: {
            id: existingAdmin.id,
            email: existingAdmin.email,
            role: existingAdmin.role
        }
      }
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Créer l'utilisateur admin
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin Météo',
        role: 'ADMIN',
      },
      select: {
        id: true,
        email: true,
        role: true,
      }
    })

    return {
      statusCode: 201,
      message: 'Admin user created successfully.',
      user: adminUser,
    }
  } catch (error) {
    console.error('Error seeding admin user:', error)
    // Gérer le cas où le rôle 'ADMIN' n'existe pas dans l'enum
    if (error.code === 'P2022') { // Erreur de Prisma pour les contraintes
         throw createError({
            statusCode: 500,
            statusMessage: "The 'ADMIN' role does not exist in your `Role` enum in `schema.prisma`. Please add it.",
        })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to seed admin user.',
    })
  }
}) 