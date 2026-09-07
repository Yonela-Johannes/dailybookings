import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'
import { z } from 'zod'
import { BookingStatus } from '@prisma/client'

const querySchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20'))
})

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const query = getQuery(event)

  try {
    const { status, page, limit } = querySchema.parse(query)
    const skip = (page - 1) * limit

    const where = {
      ...(status && { status })
    }

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: {
          user: { select: { fullName: true, email: true } },
          venue: { select: { name: true, slug: true } },
          services: { include: { service: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      })
    ])

    return {
      data: bookings.map(b => ({
        ...b,
        priceTotal: Number(b.priceTotal)
      })),
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
