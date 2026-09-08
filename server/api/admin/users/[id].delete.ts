import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' })
  }

  try {
    // Delete user (Prisma handles cascades if defined, but we should be careful)
    // In schema, Profile has onDelete: Cascade.
    // Businesses, Bookings, Reviews, Favorites, Notifications do not have explicit cascade.

    // For a real production app, we might want to soft-delete or handle data cleanup.
    // Given the "delete everything" confirm message in the UI, we'll proceed with deletion.

    await prisma.user.delete({
      where: { id }
    })

    return { message: 'User deleted successfully' }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete user: ' + error.message
    })
  }
})
