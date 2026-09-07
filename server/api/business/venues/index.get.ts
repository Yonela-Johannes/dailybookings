import { prisma } from '~/server/utils/prisma'
import { isBusinessOwner } from '~/server/utils/auth'
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '10'))
})

export default defineEventHandler(async (event) => {
  const user = await isBusinessOwner(event)
  const query = getQuery(event)

  try {
    const { page, limit } = querySchema.parse(query)
    const skip = (page - 1) * limit

    const where = user.role === 'PLATFORM_ADMIN' ? {} : {
      business: {
        ownerId: user.id
      }
    }

    const [total, venues] = await Promise.all([
      prisma.venue.count({ where }),
      prisma.venue.findMany({
        where,
        include: {
          category: true,
          address: true,
          contact: true,
          bookingConfig: true,
          schedules: true,
          media: true,
          _count: {
            select: {
              employees: true,
              bookings: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
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
