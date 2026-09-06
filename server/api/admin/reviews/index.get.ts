import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  venueId: z.string().uuid().optional(),
  rating: z.string().optional().transform(v => v ? parseInt(v) : undefined)
})

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)

  const query = getQuery(event)
  const { page, limit, venueId, rating } = querySchema.parse(query)
  const skip = (page - 1) * limit

  const where = {
    ...(venueId && { venueId }),
    ...(rating && { rating })
  }

  const [total, reviews] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        venue: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })
  ])

  return {
    data: reviews,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
})
