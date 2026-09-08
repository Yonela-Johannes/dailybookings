import { prisma } from '~/server/utils/prisma'
import { z } from 'zod'
import { isBusinessOwner } from '~/server/utils/auth'

const createVenueSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  tagline: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  communityId: z.string().uuid().optional().nullable().transform(v => v === '' ? null : v),
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
    phone: z.string().trim().min(5),
    whatsapp: z.string().trim().optional(),
    email: z.string().trim().email().toLowerCase(),
    website: z.string().trim().url().optional().or(z.literal('')),
    instagram: z.string().trim().optional(),
    facebook: z.string().trim().optional()
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
        communityId: data.communityId,
        status: 'DRAFT',
        address: {
          create: data.address
        },
        contact: {
          create: data.contact
        },
        bookingConfig: {
          create: data.bookingConfig
        },
        schedules: {
          createMany: {
            data: [1, 2, 3, 4, 5].map(day => ({
              day,
              opens: '09:00',
              closes: '17:00',
              closed: false
            })).concat([0, 6].map(day => ({
              day,
              opens: '09:00',
              closes: '17:00',
              closed: true
            })))
          }
        }
      },
      include: {
        address: true,
        contact: true,
        bookingConfig: true,
        schedules: true
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
