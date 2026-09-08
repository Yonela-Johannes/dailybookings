import { prisma } from '~/server/utils/prisma'
import { isBusinessOwner } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await isBusinessOwner(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Venue ID is required' })
  }

  try {
    const venue = await prisma.venue.findUnique({
      where: { id },
      include: { business: true }
    })

    if (!venue) {
      throw createError({ statusCode: 404, statusMessage: 'Venue not found' })
    }

    if (user.role !== 'PLATFORM_ADMIN' && venue.business.ownerId !== user.id) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    // Soft delete or hard delete? The admin one is hard delete.
    await prisma.venue.delete({
      where: { id }
    })

    return { message: 'Venue deleted successfully' }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete venue: ' + error.message
    })
  }
})
