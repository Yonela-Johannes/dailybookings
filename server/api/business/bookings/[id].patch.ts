import { PrismaClient } from '@prisma/client'
import { isBusinessOwner } from '~/server/utils/auth'
import { z } from 'zod'
import { BookingStatus } from '@prisma/client'

const updateBookingSchema = z.object({
  status: z.nativeEnum(BookingStatus),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await isBusinessOwner(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  // Verify ownership
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { venue: { include: { business: true } } }
  })

  if (!booking) {
    throw createError({ statusCode: 404, statusMessage: 'Booking not found' })
  }

  if (user.role !== 'PLATFORM_ADMIN' && booking.venue.business.ownerId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  try {
    const { status, notes } = updateBookingSchema.parse(body)

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status,
        notes
      }
    })

    return updatedBooking
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: error.errors
    })
  }
})
