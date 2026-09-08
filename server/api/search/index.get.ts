import { prisma } from '~/server/utils/prisma'
import { z } from 'zod'

const querySchema = z.object({
  q: z.string().optional(),
  loc: z.string().optional(),
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '10')),
  categoryId: z.string().uuid().optional(),
  minRating: z.string().optional().transform(v => v ? parseFloat(v) : undefined)
})

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  try {
    const { q, loc, page, limit, categoryId, minRating } = querySchema.parse(query)
    const skip = (page - 1) * limit

    const where: any = {
      status: 'ACTIVE',
      deletedAt: null,
      AND: [
        q ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        } : {},
        loc ? {
          address: {
            OR: [
              { city: { contains: loc, mode: 'insensitive' } },
              { suburb: { contains: loc, mode: 'insensitive' } },
              { region: { contains: loc, mode: 'insensitive' } }
            ]
          }
        } : {},
        categoryId ? { categoryId } : {},
        minRating ? { rating: { gte: minRating } } : {}
      ]
    }

    const [total, venues] = await Promise.all([
      prisma.venue.count({ where }),
      prisma.venue.findMany({
        where,
        include: {
          category: true,
          media: { where: { featured: true } },
          address: true
        },
        orderBy: {
          rating: 'desc'
        },
        skip,
        take: limit
      })
    ])

    return {
      data: venues,
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
