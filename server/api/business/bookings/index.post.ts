import { prisma } from '~/server/utils/prisma'
import { isBusinessOwner } from '~/server/utils/auth'
import { z } from 'zod'
import { BookingStatus } from '@prisma/client'
import { parse, addMinutes, format } from 'date-fns'

const createBookingSchema = z.object({
  venueId: z.string().uuid(),
  userEmail: z.string().email(),
  serviceId: z.string().uuid(),
  employeeId: z.string().uuid().or(z.literal('')).optional(),
  date: z.string(), // YYYY-MM-DD
  startTime: z.string(), // HH:mm
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const owner = await isBusinessOwner(event)
  const body = await readBody(event)

  try {
    const { venueId, userEmail, serviceId, employeeId, date, startTime, notes } = createBookingSchema.parse(body)

    // Verify ownership of venue
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      include: { business: true }
    })

    if (!venue || (owner.role !== 'PLATFORM_ADMIN' && venue.business.ownerId !== owner.id)) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden: You do not own this venue' })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Customer not found. They must have an account on DailyBookings first.'
      })
    }

    // Get service details
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      throw createError({ statusCode: 404, statusMessage: 'Service not found' })
    }

    // Calculate end time
    const bookingDate = new Date(date)
    const start = parse(startTime, 'HH:mm', bookingDate)
    const end = addMinutes(start, service.durationMinutes)
    const endTime = format(end, 'HH:mm')

    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          userId: user.id,
          venueId,
          date: bookingDate,
          startTime,
          endTime,
          durationTotal: service.durationMinutes,
          priceTotal: service.price,
          status: BookingStatus.CONFIRMED,
          notes,
          services: {
            create: {
              serviceId: service.id,
              employeeId: (employeeId && employeeId !== '') ? employeeId : null,
              price: service.price,
              durationMinutes: service.durationMinutes
            }
          }
        },
        include: {
          services: true,
          user: true
        }
      })

      // Create a pending payment record for manual bookings
      await tx.payment.create({
        data: {
          bookingId: newBooking.id,
          amount: service.price,
          status: 'PENDING',
          provider: 'MANUAL'
        }
      })

      return newBooking
    })

    return booking
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Validation failed',
      data: error.errors
    })
  }
})
