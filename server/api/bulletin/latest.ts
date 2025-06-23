import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const bulletin = await prisma.bulletin.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, bulletin }
  } catch (error) {
    console.error('Erreur lors de la récupération du dernier bulletin:', error)
    throw createError({ statusCode: 500, statusMessage: 'Erreur lors de la récupération du bulletin' })
  }
}) 