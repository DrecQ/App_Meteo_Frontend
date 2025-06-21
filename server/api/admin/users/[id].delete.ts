import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // La protection de cette route est gérée par le middleware Nuxt
  // qui vérifie si l'utilisateur est un admin.

  try {
    const userIdToDelete = event.context.params?.id;

    if (!userIdToDelete) {
      throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
    }

    // TODO: Ajouter une logique pour empêcher un admin de se supprimer lui-même,
    // ce qui nécessiterait de connaître l'ID de l'admin qui fait la requête.

    await prisma.user.delete({
      where: { id: userIdToDelete },
    })

    return { success: true }
  } catch (error) {
    console.error(`Error deleting user ${event.context.params?.id}:`, error)
    if(error.code === 'P2025'){ // Record to delete does not exist
        throw createError({ statusCode: 404, statusMessage: 'User not found.' });
    }
    if(error.statusCode) throw error;
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete user.' })
  }
}) 