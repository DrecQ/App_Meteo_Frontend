import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const userId = event.context.params?.id

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required',
    })
  }

  try {
    const coursesStarted = await prisma.userCourse.count({
      where: { userId: userId },
    })

    const coursesCompleted = await prisma.userCourse.count({
      where: { userId: userId, completed: true },
    })

    const certificatesCount = await prisma.certificate.count({
      where: { userId: userId },
    })

    const quizResults = await prisma.quizResult.findMany({
      where: { userId: userId },
      select: { score: true, maxScore: true },
    })

    const averageScore = quizResults.length > 0
      ? quizResults.reduce((acc, curr) => acc + (curr.score / curr.maxScore) * 100, 0) / quizResults.length
      : 0

    // Liste des cours suivis avec progression
    const userCourses = await prisma.userCourse.findMany({
      where: { userId: userId },
      include: {
        course: {
          select: { id: true, title: true, slug: true, duration: true, level: true, createdAt: true }
        }
      },
      orderBy: { startedAt: 'desc' }
    });

    const coursesFollowed = userCourses.map(uc => ({
      id: uc.course.id,
      title: uc.course.title,
      slug: uc.course.slug,
      duration: uc.course.duration,
      level: uc.course.level,
      startedAt: uc.startedAt,
      completedAt: uc.completedAt,
      completed: uc.completed,
      progress: uc.progress
    }));

    return {
      coursesStarted,
      coursesCompleted,
      certificatesCount,
      averageScore: Math.round(averageScore),
      coursesFollowed
    }
  } catch (error) {
    console.error(`Error fetching stats for user ${userId}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
}) 