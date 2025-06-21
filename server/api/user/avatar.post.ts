import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // L'utilisateur est déjà authentifié par le middleware
    const user = event.context.user

    // Récupérer le fichier uploadé
    const formData = await readMultipartFormData(event)
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Aucun fichier fourni'
      })
    }

    const file = formData.find(item => item.name === 'avatar')
    if (!file) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Fichier avatar manquant'
      })
    }

    // Vérifier le type de fichier
    if (!file.type?.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le fichier doit être une image'
      })
    }

    // Vérifier la taille du fichier (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.data && file.data.length > maxSize) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le fichier est trop volumineux (max 5MB)'
      })
    }

    // Générer un nom de fichier unique
    const fileExtension = file.filename?.split('.').pop() || 'jpg'
    const fileName = `${user.id}-${Date.now()}.${fileExtension}`
    
    // Pour l'instant, on va stocker l'image en base64 dans la base de données
    // Dans un vrai projet, vous devriez uploader vers un service comme Cloudinary ou AWS S3
    const base64Image = `data:${file.type};base64,${Buffer.from(file.data).toString('base64')}`

    // Mettre à jour l'avatar de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        avatar: base64Image,
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
      message: 'Photo de profil mise à jour avec succès',
      avatar: base64Image,
      user: updatedUser
    }

  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'avatar:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
}) 