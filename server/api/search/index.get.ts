import { prisma } from '~/server/utils/prisma'
import { z } from 'zod'

const querySchema = z.object({
  q: z.string().optional(),
  loc: z.string().optional(),
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '10')),
  categoryId: z.string().uuid().optional()
})

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  try {
    const { q, loc, page, limit, categoryId } = querySchema.parse(query)
    const skip = (page - 1) * limit

    if (!q && !loc && !categoryId) {
      return {
        data: [],
        meta: { total: 0, page, limit, totalPages: 0 }
      }
    }

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
        categoryId ? { categoryId } : {}
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
