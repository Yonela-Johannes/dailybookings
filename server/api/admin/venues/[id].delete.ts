import { isPlatformAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const id = getRouterParam(event, 'id')

  try {
    await prisma.venue.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    })

    return {
      message: 'Venue soft-deleted successfully',
    }
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Venue not found'
      })
    }
    throw error
  }
})
