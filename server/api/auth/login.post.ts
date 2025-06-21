import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event)
    console.log(`Tentative de connexion pour: ${email}`);

    // Validation des données
    if (!email || !password) {
      console.log('Validation échouée: email ou mot de passe manquant.');
      throw createError({
        statusCode: 400,
        statusMessage: 'Email et mot de passe requis'
      })
    }

    // Trouver l'utilisateur
    console.log(`Recherche de l'utilisateur: ${email}`);
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        courses: {
          include: {
            course: {
              include: {
                lessons: true
              }
            }
          }
        },
        certificates: true
      }
    })

    if (user) {
      console.log(`Utilisateur trouvé: ${user.id}`);
    } else {
      console.log(`Utilisateur non trouvé pour l'email: ${email}`);
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou mot de passe incorrect'
      })
    }

    // Vérifier le mot de passe
    console.log('Vérification du mot de passe...');
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      console.log(`Mot de passe invalide pour l'utilisateur: ${email}`);
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou mot de passe incorrect'
      })
    }
    console.log('Mot de passe valide.');

    // Formatter les données utilisateur pour le frontend
    console.log('Formatage des données utilisateur...');
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      domaineActivite: user.domaineActivite,
      avatar: user.avatar,
      createdAt: user.createdAt,
      courses: user.courses.map(e => e.course),
      certificates: user.certificates
    }
    console.log(`Connexion réussie pour: ${email}`);

    return {
      success: true,
      message: 'Connexion réussie',
      user: userData
    }

  } catch (error) {
    console.error('Erreur détaillée lors de la connexion:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la connexion'
    })
  }
}) 