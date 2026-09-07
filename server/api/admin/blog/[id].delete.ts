import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const id = getRouterParam(event, 'id')

  try {
    await prisma.blog.delete({
      where: { id }
    })
    return { message: 'Article deleted successfully' }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete article'
    })
  }
})
