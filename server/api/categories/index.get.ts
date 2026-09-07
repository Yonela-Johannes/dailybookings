import { prisma } from '~/server/utils/prisma'
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '50'))
})

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  try {
    const { page, limit } = querySchema.parse(query)
    const skip = (page - 1) * limit

    const [total, categories] = await Promise.all([
      prisma.category.count(),
      prisma.category.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' }
      })
    ])

    return {
      data: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
