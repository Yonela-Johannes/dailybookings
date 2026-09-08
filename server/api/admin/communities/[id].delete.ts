import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const id = getRouterParam(event, 'id')

  try {
    await prisma.community.delete({
      where: { id }
    })

    return { success: true }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Delete failed',
      data: error.message
    })
  }
})
