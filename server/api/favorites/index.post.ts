import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { z } from 'zod'

const favoriteSchema = z.object({
  venueId: z.string().uuid()
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  try {
    const { venueId } = favoriteSchema.parse(body)

    // Toggle logic
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_venueId: {
          userId: user.id,
          venueId
        }
      }
    })

    if (existing) {
      await prisma.favorite.delete({
        where: {
          userId_venueId: {
            userId: user.id,
            venueId
          }
        }
      })
      return { success: true, message: 'Removed from favorites', removed: true }
    } else {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          venueId
        }
      })
      return { success: true, message: 'Added to favorites', removed: false }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to update favorites: ' + (error.errors?.[0]?.message || error.message)
    })
  }
})
