import { prisma } from '~/server/utils/prisma'
import { isBusinessOwner } from '~/server/utils/auth'
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  venueId: z.string().uuid().optional(),
  rating: z.string().optional().transform(v => v ? parseInt(v) : undefined)
})

export default defineEventHandler(async (event) => {
  const user = await isBusinessOwner(event)
  const query = getQuery(event)

  try {
    const { page, limit, venueId, rating } = querySchema.parse(query)
    const skip = (page - 1) * limit

    const where: any = {
      venue: user.role === 'PLATFORM_ADMIN' ?
        (venueId ? { id: venueId } : {}) :
        {
          business: {
            ownerId: user.id
          }
        }
    }

    if (venueId) where.venueId = venueId
    if (rating) where.rating = rating

    const [total, reviews, avgResult] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              profile: {
                select: {
                  avatarUrl: true
                }
              }
            }
          },
          venue: {
            select: {
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.review.aggregate({
        where,
        _avg: {
          rating: true
        }
      })
    ])

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        averageRating: avgResult._avg.rating || 0
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }
})
