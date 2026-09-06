import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required'
    })
  }

  try {
    const venue = await prisma.venue.findUnique({
      where: { slug },
      include: {
        address: true,
        contact: true,
        bookingConfig: true,
        serviceCategories: {
          include: {
            services: true
          }
        },
        employees: true,
        media: true,
        schedules: true,
        reviews: {
          take: 10,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                fullName: true,
                profile: {
                  select: {
                    avatarUrl: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!venue || venue.deletedAt) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Venue not found'
      })
    }

    return venue
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message
    })
  }
})
