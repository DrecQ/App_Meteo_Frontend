import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: Add admin-only protection

  try {
    const courseId = event.context.params?.id

    if (!courseId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Course ID is required',
      })
    }
    
    // Avant de supprimer, il faudrait idéalement gérer les relations (quiz, inscriptions, etc.).
    // Prisma peut lever une erreur de contrainte de clé étrangère si des quiz
    // sont toujours liés à ce cours. Pour une suppression en cascade,
    // il faudrait configurer `onDelete: Cascade` dans le `schema.prisma`.
    // Pour l'instant, on tente la suppression directe.

    await prisma.course.delete({
      where: { id: courseId },
    })

    return { success: true, message: 'Course deleted successfully.' }
  } catch (error) {
    console.error(`Error deleting course ${event.context.params?.id}:`, error)
    
    // Gérer l'erreur de contrainte de clé étrangère
    if (error.code === 'P2003') { // Code d'erreur de Prisma pour les contraintes de clé étrangère
        throw createError({
            statusCode: 409, // Conflict
            statusMessage: "Cannot delete this course because it has related quizzes or enrollments. Please remove them first.",
        });
    }

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete course.',
    })
  }
}) 