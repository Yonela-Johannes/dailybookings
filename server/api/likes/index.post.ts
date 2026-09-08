import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { z } from 'zod'

const likeSchema = z.object({
  venueId: z.string().uuid()
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  try {
    const { venueId } = likeSchema.parse(body)

    // Toggle logic
    const existing = await prisma.like.findUnique({
      where: {
        userId_venueId: {
          userId: user.id,
          venueId
        }
      }
    })

    if (existing) {
      await prisma.like.delete({
        where: {
          userId_venueId: {
            userId: user.id,
            venueId
          }
        }
      })
      return { success: true, message: 'Removed like', liked: false }
    } else {
      await prisma.like.create({
        data: {
          userId: user.id,
          venueId
        }
      })
      return { success: true, message: 'Added like', liked: true }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to update like: ' + (error.errors?.[0]?.message || error.message)
    })
  }
})
