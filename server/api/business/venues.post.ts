import { prisma } from '~/server/utils/prisma'
import { z } from 'zod'
import { isBusinessOwner } from '~/server/utils/auth'

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
    country: z.string().default('South Africa'),
    lat: z.number().optional(),
    lng: z.number().optional()
  }),
  contact: z.object({
    phone: z.string(),
    whatsapp: z.string().optional(),
    email: z.string().email(),
    website: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional()
  }),
  bookingConfig: z.object({
    instantConfirmation: z.boolean().default(true),
    acceptsOnlinePayments: z.boolean().default(false),
    requiresDeposit: z.boolean().default(false),
    depositPercentage: z.number().default(0),
    cancellationPolicy: z.string().optional(),
    minimumNoticeMinutes: z.number().default(60)
  })
})

export default defineEventHandler(async (event) => {
  const user = await isBusinessOwner(event)
  const body = await readBody(event)

  try {
    const data = createVenueSchema.parse(body)

    // Find user's business or create one if missing
    let business = await prisma.business.findFirst({
      where: { ownerId: user.id }
    })

    if (!business) {
      business = await prisma.business.create({
        data: {
          ownerId: user.id,
          name: `${user.fullName || 'My'} Business`
        }
      })
    }

    const venue = await prisma.venue.create({
      data: {
        businessId: business.id,
        slug: data.slug,
        name: data.name,
        tagline: data.tagline,
        description: data.description,
        categoryId: data.categoryId,
        status: 'DRAFT',
        address: {
          create: data.address
        },
        contact: {
          create: data.contact
        },
        bookingConfig: {
          create: data.bookingConfig
        }
      },
      include: {
        address: true,
        contact: true,
        bookingConfig: true
      }
    })

    return venue
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: error.errors
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create venue: ' + error.message
    })
  }
})
