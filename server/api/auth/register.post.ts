import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const { email, password, name, domaineActivite } = await readBody(event)
    console.log(`Tentative d'inscription pour: ${email}`);

    // Validation des données
    if (!email || !password || !name || !domaineActivite) {
      console.log('Validation échouée: champs manquants.');
      throw createError({
        statusCode: 400,
        statusMessage: 'Tous les champs sont requis'
      })
    }

    // Vérifier si l'email existe déjà
    console.log(`Vérification de l'existence de l'email: ${email}`);
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log(`L'email ${email} existe déjà.`);
      throw createError({
        statusCode: 409,
        statusMessage: 'Un utilisateur avec cet email existe déjà'
      })
    }
    console.log(`L'email ${email} est disponible.`);

    // Hasher le mot de passe
    console.log('Hashage du mot de passe...');
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('Mot de passe hashé.');

    // Créer l'utilisateur
    console.log('Création de l\'utilisateur...');
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
    console.log(`Utilisateur créé avec succès: ${user.id}`);

    return {
      success: true,
      message: 'Inscription réussie',
      user
    }

  } catch (error) {
    console.error('Erreur détaillée lors de l\'inscription:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'inscription'
    })
  }
}) 