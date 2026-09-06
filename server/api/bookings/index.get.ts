import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '~/server/utils/prisma'
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '10'))
})

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)

  try {
    const { page, limit } = querySchema.parse(query)
    const skip = (page - 1) * limit
    const where = { userId: user.id }

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              slug: true,
              address: true,
              media: {
                where: { featured: true },
                take: 1
              }
            }
          },
          services: {
            include: {
              service: true
            }
          },
          payment: true
        },
        orderBy: { date: 'desc' },
        skip,
        take: limit
      })
    ])

    return {
      data: bookings,
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
