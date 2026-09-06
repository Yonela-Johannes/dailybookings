import { z } from 'zod'
import { serverSupabaseUser } from '#supabase/server'
import { PrismaClient } from '@prisma/client'

const reviewSchema = z.object({
  venueId: z.string(),
  rating: z.number().min(1).max(5),
  body: z.string().optional(),
  serviceName: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const validation = reviewSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input: ' + validation.error.message,
    })
  }

  const { venueId, rating, body: reviewBody, serviceName } = validation.data

  // Check if user has a COMPLETED booking at this venue
  const completedBooking = await prisma.booking.findFirst({
    where: {
      userId: user.id,
      venueId,
      status: 'COMPLETED',
    },
  })

  if (!completedBooking) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Only customers with completed bookings at this venue can leave a review.',
    })
  }

  return await prisma.review.create({
    data: {
      userId: user.id,
      venueId,
      rating,
      body: reviewBody || null,
      serviceName: serviceName || null,
      verified: true
    },
  })
})
