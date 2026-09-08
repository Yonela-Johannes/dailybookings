import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Subscriber ID is required' })
  }

  try {
    await prisma.newsletterSubscriber.delete({
      where: { id }
    })
    return { success: true, message: 'Subscriber removed' }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete subscriber: ' + error.message
    })
  }
})
