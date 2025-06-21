import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  // NOTE: Cet endpoint est pour le développement uniquement.
  const email = 'test@test.com'

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return { message: 'L\'utilisateur de test existe déjà.' }
    }

    const hashedPassword = await bcrypt.hash('password', 10)

    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: 'Utilisateur de Test',
        domaineActivite: 'Test',
      },
    })

    return {
      message: 'Utilisateur de test créé avec succès !',
      user: { id: user.id, email: user.email, name: user.name },
    }
  } catch (error) {
    console.error("Erreur détaillée lors de la création de l'utilisateur de test:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la création de l'utilisateur de test.",
    })
  }
}) 