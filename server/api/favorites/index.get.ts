import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        venue: {
          include: {
            category: true,
            address: true,
            media: {
              where: { featured: true },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return {
      success: true,
      data: favorites.map(f => ({
        ...f.venue,
        favoriteId: f.id
      }))
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch favorites: ' + error.message
    })
  }
})
