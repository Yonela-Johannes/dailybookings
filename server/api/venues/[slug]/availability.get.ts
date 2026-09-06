import { PrismaClient } from '@prisma/client'
import { calculateAvailableSlots } from '~/server/utils/availability'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const slug = getRouterParam(event, 'slug')
  const query = getQuery(event)

  const { date, serviceIds, employeeId } = query

  if (!slug || !date || !serviceIds) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing parameters: slug, date, serviceIds'
    })
  }

  const venue = await prisma.venue.findUnique({
    where: { slug }
  })

  if (!venue) {
    throw createError({ statusCode: 404, statusMessage: 'Venue not found' })
  }

  // Handle case where serviceIds is a single string or an array
  const serviceIdsArray = Array.isArray(serviceIds)
    ? serviceIds as string[]
    : [serviceIds as string]

  const bookingDate = new Date(date as string)

  try {
    const slots = await calculateAvailableSlots(
      venue.id,
      serviceIdsArray,
      (employeeId as string) || null,
      bookingDate
    )
    return slots
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error calculating availability: ' + error.message
    })
  }
})
