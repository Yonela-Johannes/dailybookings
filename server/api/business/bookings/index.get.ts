import { prisma } from '~/server/utils/prisma'
import { isBusinessOwner } from '~/server/utils/auth'
import { z } from 'zod'
import { BookingStatus } from '@prisma/client'

const querySchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  venueId: z.string().uuid().optional(),
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20'))
})

export default defineEventHandler(async (event) => {
  const user = await isBusinessOwner(event)
  const query = getQuery(event)

  try {
    const { status, startDate, endDate, venueId, page, limit } = querySchema.parse(query)
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

    if (venueId) where.id = venueId // Correction: venueId was being used incorrectly in the 'where' object for booking

    // Corrected 'where' for Booking model
    const bookingWhere: any = {
      venue: user.role === 'PLATFORM_ADMIN' ?
        (venueId ? { id: venueId } : {}) :
        {
          business: {
            ownerId: user.id
          }
        }
    }

    if (venueId) bookingWhere.venueId = venueId
    if (status) bookingWhere.status = status
    if (startDate || endDate) {
      bookingWhere.date = {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined
      }
    }

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where: bookingWhere }),
      prisma.booking.findMany({
        where: bookingWhere,
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
          services: {
            include: {
              service: true,
              employee: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      })
    ])

    return {
      data: bookings.map(b => ({
        ...b,
        priceTotal: Number(b.priceTotal),
        services: b.services.map(s => ({
          ...s,
          price: Number(s.price)
        }))
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
      statusMessage: 'Invalid query parameters',
      data: error.errors
    })
  }
})
