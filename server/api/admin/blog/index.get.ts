import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional()
})

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const query = getQuery(event)

  try {
    const { page, limit, search } = querySchema.parse(query)
    const skip = (page - 1) * limit

    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    const [total, blogs] = await Promise.all([
      prisma.blog.count({ where }),
      prisma.blog.findMany({
        where,
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' },
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
