import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const categories = await prisma.blogCategory.findMany({
      include: {
        _count: {
          select: { blogs: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return categories
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch blog categories: ' + error.message
    })
  }
})
