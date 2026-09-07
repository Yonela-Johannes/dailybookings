import { prisma } from '~/server/utils/prisma'
import { serverSupabaseUser } from '#supabase/server'
import { z } from 'zod'
import { BookingStatus } from '@prisma/client'

const updateBookingSchema = z.object({
  status: z.literal('CANCELLED')
})

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const booking = await prisma.booking.findUnique({
    where: { id }
  })

  if (!booking) {
    throw createError({ statusCode: 404, statusMessage: 'Booking not found' })
  }

  if (booking.userId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  try {
    const { status } = updateBookingSchema.parse(body)
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status }
    })
    return updatedBooking
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid update'
    })
  }
})
