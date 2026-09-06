import { PrismaClient } from '@prisma/client'
import { isBusinessOwner } from '~/server/utils/auth'
import { z } from 'zod'
import { BookingStatus } from '@prisma/client'

const querySchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  venueId: z.string().uuid().optional()
})

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await isBusinessOwner(event)
  const query = getQuery(event)

  try {
    const { status, startDate, endDate, venueId } = querySchema.parse(query)

    const bookings = await prisma.booking.findMany({
      where: {
        venue: user.role === 'PLATFORM_ADMIN' ?
          (venueId ? { id: venueId } : {}) :
          {
            id: venueId,
            business: {
              ownerId: user.id
            }
          },
        status: status,
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined
        }
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            profile: {
              select: {
                phone: true
              }
            }
          }
        },
        venue: {
          select: {
            name: true
          }
        },
        employee: {
          select: {
            name: true
          }
        },
        services: {
          include: {
            service: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return bookings
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query parameters',
      data: error.errors
    })
  }
})
