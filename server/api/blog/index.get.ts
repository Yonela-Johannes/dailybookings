import { prisma } from '~/server/utils/prisma'
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '10')),
  category: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  try {
    const { page, limit, category } = querySchema.parse(query)
    const skip = (page - 1) * limit

    const where: any = {
      published: true
    }

    if (category) {
      where.category = {
        slug: category
      }
    }

    const [total, blogs] = await Promise.all([
      prisma.blog.count({ where }),
      prisma.blog.findMany({
        where,
        include: {
          category: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      })
    ])

    return {
      data: blogs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }
})
