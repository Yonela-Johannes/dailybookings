import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { z } from 'zod'

const commentSchema = z.object({
  body: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const reviewId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!reviewId) {
    throw createError({ statusCode: 400, statusMessage: 'Review ID is required' })
  }

  try {
    const { body: commentBody } = commentSchema.parse(body)

    const comment = await prisma.comment.create({
      data: {
        userId: user.id,
        reviewId,
        body: commentBody
      },
      include: {
        user: {
          select: { fullName: true, profile: { select: { avatarUrl: true } } }
        }
      }
    })

    return comment
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to create comment: ' + (error.errors?.[0]?.message || error.message)
    })
  }
})
