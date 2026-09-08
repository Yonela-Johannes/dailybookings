import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  try {
    const likes = await prisma.like.findMany({
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
      data: likes.map(l => ({
        ...l.venue,
        likeId: l.id
      }))
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch likes: ' + error.message
    })
  }
})
