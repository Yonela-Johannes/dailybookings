import { z } from 'zod'
import { isPlatformAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { VenueStatus } from '@prisma/client'

const querySchema = z.object({
  page: z.string().optional().transform(v => v ? parseInt(v) : 1),
  limit: z.string().optional().transform(v => v ? parseInt(v) : 20),
  search: z.string().optional().transform(v => v === '' ? undefined : v),
  status: z.string().optional().transform(v => v === '' ? undefined : v).pipe(z.nativeEnum(VenueStatus).optional()),
})

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)

  const query = getQuery(event)
  const result = querySchema.safeParse(query)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query parameters',
      data: result.error.format(),
    })
  }

  const { page, limit, search, status } = result.data
  const skip = (page - 1) * limit

  const where: any = {
    deletedAt: null,
  }

  if (status) {
    where.status = status
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [total, venues] = await Promise.all([
    prisma.venue.count({ where }),
    prisma.venue.findMany({
      where,
      include: {
        business: {
          include: {
            owner: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
          },
        },
        category: true,
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ])

  return {
    venues,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
})
