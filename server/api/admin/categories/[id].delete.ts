import { isPlatformAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const id = getRouterParam(event, 'id')

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { venues: true }
      }
    }
  })

  if (!category) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category not found'
    })
  }

  if (category._count.venues > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Cannot delete category "${category.name}" as it is linked to ${category._count.venues} venue(s).`
    })
  }

  await prisma.category.delete({
    where: { id }
  })

  return { message: 'Category deleted successfully' }
})
