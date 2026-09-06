import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async () => {
  const prisma = new PrismaClient()
  try {
    const [featuredVenues, popularCategories, trendingServices] = await Promise.all([
      // featuredVenues: highly rated, verified, with featured media
      prisma.venue.findMany({
        where: {
          status: 'active',
          business: {
            verified: true
          }
        },
        orderBy: {
          rating: 'desc'
        },
        take: 6,
        include: {
          media: {
            where: { featured: true }
          },
          category: true
        }
      }),
      // popularCategories: categories with most venues
      prisma.category.findMany({
        include: {
          _count: {
            select: { venues: true }
          }
        },
        orderBy: {
          venues: {
            _count: 'desc'
          }
        },
        take: 8
      }),
      // trendingServices: services marked as popular
      prisma.service.findMany({
        where: {
          popular: true
        },
        take: 10,
        include: {
          category: {
            include: {
              venue: {
                include: {
                  media: {
                    where: { featured: true }
                  }
                }
              }
            }
          }
        }
      })
    ])

    return {
      featuredVenues,
      popularCategories,
      trendingServices
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
