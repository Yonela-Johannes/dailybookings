import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().optional().transform(v => v ? parseInt(v) : 1),
  limit: z.string().optional().transform(v => v ? parseInt(v) : 20),
  search: z.string().optional().transform(v => v === '' ? undefined : v)
})

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)

  const query = getQuery(event)
  try {
    const { page, limit, search } = querySchema.parse(query)
    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.email = { contains: search, mode: 'insensitive' }
    }

    const [total, subscribers] = await Promise.all([
      prisma.newsletterSubscriber.count({ where }),
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      })
    ])

    return {
      data: subscribers,
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
      statusMessage: 'Invalid query parameters'
    })
  }
})
