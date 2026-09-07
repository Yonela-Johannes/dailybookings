import { prisma } from '~/server/utils/prisma'
import { z } from 'zod'
import { calculateAvailableSlots } from '~/server/utils/availability'

const querySchema = z.object({
  venueId: z.string().uuid().optional(),
  slug: z.string().optional(),
  serviceIds: z.string().min(1).transform(val => val.split(',')),
  employeeId: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
})

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  try {
    const { venueId, slug, serviceIds, employeeId, date } = querySchema.parse(query)

    let targetVenueId = venueId

    if (!targetVenueId && slug) {
      const venue = await prisma.venue.findUnique({
        where: { slug },
        select: { id: true }
      })
      if (!venue) {
        throw createError({ statusCode: 404, statusMessage: 'Venue not found' })
      }
      targetVenueId = venue.id
    }

    if (!targetVenueId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Either venueId or slug is required'
      })
    }

    const parsedDate = new Date(date)
    const slots = await calculateAvailableSlots(
      targetVenueId,
      serviceIds,
      employeeId,
      parsedDate
    )

    return slots
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid parameters',
      data: error.errors
    })
  }
})
