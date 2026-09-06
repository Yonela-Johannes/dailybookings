import { prisma } from '~/server/utils/prisma'
import { z } from 'zod'

const createVenueSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  tagline: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  address: z.object({
    street: z.string(),
    suburb: z.string(),
    city: z.string(),
    region: z.string(),
    postalCode: z.string(),
    country: z.string(),
    lat: z.number().optional(),
    lng: z.number().optional()
  }),
  contact: z.object({
    phone: z.string(),
    whatsapp: z.string().optional(),
    email: z.string().email()
  }),
  bookingConfig: z.object({
    instant: z.boolean().default(true),
    onlinePay: z.boolean().default(false),
    deposit: z.boolean().default(false),
    depositPct: z.number().default(0),
    cancellationPolicy: z.string().optional(),
    minNoticeMinutes: z.number().default(60)
  })
})

export default defineEventHandler(async (event) => {

  // In a real app, we would verify the user session here
  // const user = event.context.user

  const body = await readBody(event)
  const ownerId = body.ownerId // Temporarily taking from body for this implementation

  if (!ownerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Owner ID is required'
    })
  }

  try {
    const data = createVenueSchema.parse(body)

    const venue = await prisma.venue.create({
      data: {
        name: data.name,
        slug: data.slug,
        tagline: data.tagline,
        description: data.description,
        categoryId: data.categoryId,
        ownerId: ownerId,
        address: data.address as any,
        contact: data.contact as any,
        bookingConfig: data.bookingConfig as any,
        status: 'active'
      }
    })

    return venue
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to create venue',
      data: error.message
    })
  }
})
