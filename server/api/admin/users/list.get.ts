import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: Ajouter une vérification pour s'assurer que seul un admin peut accéder à cette route.

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        avatar: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      avatarUrl: user.avatar || '/default-avatar.svg'
    }))
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste d'utilisateurs:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur serveur lors de la récupération des utilisateurs.",
    })
  }
}) 