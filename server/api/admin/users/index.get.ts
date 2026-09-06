import { z } from 'zod'
import { isPlatformAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { UserRole } from '@prisma/client'

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('20'),
  search: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
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

  const { page, limit, search, role } = result.data
  const skip = (page - 1) * limit

  const where: any = {
    deletedAt: null,
  }

  if (role) {
    where.role = role
  }

  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { fullName: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      include: {
        profile: true,
        _count: {
          select: {
            businesses: true,
            bookings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ])

  return {
    users,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
})
