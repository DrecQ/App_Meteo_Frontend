import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { title, content, createdBy } = body
    if (!title || !content) {
      throw createError({ statusCode: 400, statusMessage: 'Titre et contenu requis' })
    }
    const bulletin = await prisma.bulletin.create({
      data: { title, content, createdBy }
    })
    return { success: true, bulletin }
  } catch (error) {
    console.error('Erreur lors de la création du bulletin:', error)
    throw createError({ statusCode: 500, statusMessage: 'Erreur lors de la création du bulletin' })
  }
}) 