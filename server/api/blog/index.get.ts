import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const query = getQuery(event)
  const { limit, category } = query

  const where: any = {
    published: true
  }

  if (category) {
    where.category = {
      slug: String(category)
    }
  }

  try {
    const blogs = await prisma.blog.findMany({
      where,
      take: limit ? parseInt(limit as string) : undefined,
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return blogs
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
