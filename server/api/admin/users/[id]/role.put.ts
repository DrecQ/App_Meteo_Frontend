import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: Add admin-only protection
  // Important: un admin ne devrait pas pouvoir retirer son propre rôle d'admin
  // s'il est le dernier. Cette logique est à ajouter pour la robustesse.

  try {
    const userId = event.context.params?.id
    const { role } = await readBody(event)

    if (!userId) {
      throw createError({ statusCode: 400, statusMessage: 'User ID is required' })
    }

    // Valider que le rôle est une des valeurs de l'enum
    if (!role || !Object.values(Role).includes(role)) {
        throw createError({ statusCode: 400, statusMessage: 'A valid role is required' })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true } // Ne pas retourner le mot de passe
    })

    return updatedUser
  } catch (error) {
    console.error(`Error updating role for user ${event.context.params?.id}:`, error)
    if(error.statusCode) throw error;
    throw createError({ statusCode: 500, statusMessage: 'Failed to update user role.' })
  }
}) 