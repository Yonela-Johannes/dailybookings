import { prisma } from '~/server/utils/prisma'
import { isBusinessOwner } from '~/server/utils/auth'
import { z } from 'zod'

import { VenueStatus } from '@prisma/client'

const updateVenueSchema = z.object({
  name: z.string().min(2).optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  status: z.nativeEnum(VenueStatus).optional(),
  address: z.object({
    street: z.string(),
    suburb: z.string(),
    city: z.string(),
    region: z.string(),
    postalCode: z.string(),
    country: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional()
  }).optional(),
  contact: z.object({
    phone: z.string(),
    whatsapp: z.string().optional(),
    email: z.string().email(),
    website: z.string().url().optional().or(z.literal('')),
    instagram: z.string().optional(),
    facebook: z.string().optional()
  }).optional(),
  bookingConfig: z.object({
    instantConfirmation: z.boolean().optional(),
    acceptsOnlinePayments: z.boolean().optional(),
    requiresDeposit: z.boolean().optional(),
    depositPercentage: z.number().min(0).max(100).optional(),
    cancellationPolicy: z.string().optional(),
    minimumNoticeMinutes: z.number().min(0).optional()
  }).optional(),
  schedules: z.array(z.object({
    day: z.number().min(0).max(6),
    opens: z.string().nullable().optional(),
    closes: z.string().nullable().optional(),
    closed: z.boolean().default(false)
  })).optional()
})

export default defineEventHandler(async (event) => {

  const user = await isBusinessOwner(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  // Verify ownership
  const venue = await prisma.venue.findUnique({
    where: { id },
    include: { business: true }
  })

  if (!venue) {
    throw createError({ statusCode: 404, statusMessage: 'Venue not found' })
  }

  if (user.role !== 'PLATFORM_ADMIN' && venue.business.ownerId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  try {
    const data = updateVenueSchema.parse(body)

    // Handle schedules update
    if (data.schedules) {
      for (const schedule of data.schedules) {
        await prisma.venueSchedule.upsert({
          where: {
            venueId_day: {
              venueId: id!,
              day: schedule.day
            }
          },
          update: {
            opens: schedule.opens,
            closes: schedule.closes,
            closed: schedule.closed
          },
          create: {
            venueId: id!,
            day: schedule.day,
            opens: schedule.opens,
            closes: schedule.closes,
            closed: schedule.closed
          }
        })
      }
    }

    const updatedVenue = await prisma.venue.update({
      where: { id },
      data: {
        name: data.name,
        tagline: data.tagline,
        description: data.description,
        categoryId: data.categoryId,
        status: data.status,
        address: data.address ? {
          update: data.address
        } : undefined,
        contact: data.contact ? {
          update: data.contact
        } : undefined,
        bookingConfig: data.bookingConfig ? {
          update: data.bookingConfig
        } : undefined
      },
      include: {
        address: true,
        contact: true,
        bookingConfig: true,
        schedules: true,
        media: true
      }
    })

    return updatedVenue
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: error.errors
    })
  }
})
