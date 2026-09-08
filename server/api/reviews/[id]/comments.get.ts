import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const reviewId = getRouterParam(event, 'id')

  if (!reviewId) {
    throw createError({ statusCode: 400, statusMessage: 'Review ID is required' })
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { reviewId },
      include: {
        user: {
          select: { fullName: true, profile: { select: { avatarUrl: true } } }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    return comments
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch comments: ' + error.message
    })
  }
})
