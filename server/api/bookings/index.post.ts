import { z } from 'zod'
import { serverSupabaseUser } from '#supabase/server'
import { PrismaClient } from '@prisma/client'
import { calculateAvailableSlots } from '~/server/utils/availability'
import { addMinutes, parse, format } from 'date-fns'

const bookingSchema = z.object({
  venueId: z.string(),
  serviceIds: z.array(z.string()),
  employeeId: z.string().optional(),
  date: z.string(), // ISO date string
  startTime: z.string(), // HH:mm
  notes: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const validation = bookingSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input: ' + validation.error.message,
    })
  }

  const { venueId, serviceIds, employeeId, date, startTime, notes } = validation.data
  const bookingDate = new Date(date)

  // 1. Fetch Services to calculate duration and price
  const services = await prisma.service.findMany({
    where: { id: { in: serviceIds } },
  })

  if (services.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid services selected' })
  }

  const totalDuration = services.reduce((acc, s) => acc + s.durationMinutes, 0)
  const totalPrice = services.reduce((acc, s) => acc + Number(s.price), 0)

  // 2. Calculate end time
  const start = parse(startTime, 'HH:mm', bookingDate)
  const end = addMinutes(start, totalDuration)
  const endTime = format(end, 'HH:mm')

  // 3. Re-validate availability
  const availableSlots = await calculateAvailableSlots(
    venueId,
    serviceIds,
    employeeId || null,
    bookingDate
  )

  const isAvailable = availableSlots.some(
    (slot) => slot.startTime === startTime && slot.endTime === endTime
  )

  if (!isAvailable) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Selected slot is no longer available',
    })
  }

  // 4. Create Booking and related records in a transaction
  try {
    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          userId: user.id,
          venueId,
          employeeId: employeeId || null,
          date: bookingDate,
          startTime,
          endTime,
          durationTotal: totalDuration,
          priceTotal: totalPrice,
          status: 'PENDING',
          notes,
          services: {
            create: services.map((s) => ({
              serviceId: s.id,
              price: s.price,
            })),
          },
          payment: {
            create: {
              amount: totalPrice,
              status: 'PENDING',
            },
          },
        },
        include: {
          services: true,
          payment: true,
          venue: true,
        },
      })

      return newBooking
    })

    return booking
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create booking: ' + error.message,
    })
  }
})
