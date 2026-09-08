import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'
import { z } from 'zod'

const updateReviewSchema = z.object({
  verified: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    const data = updateReviewSchema.parse(body)

    const review = await prisma.review.update({
      where: { id },
      data
    })

    return review
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to update review',
      data: error.errors
    })
  }
})
