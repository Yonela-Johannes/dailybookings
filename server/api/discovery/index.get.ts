import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {

  try {
    const [recommended, trending, newArrivals, popularCategories, trendingServices, communityMedia, communities] = await Promise.all([
      // recommended: highly rated, verified
      prisma.venue.findMany({
        where: {
          status: 'ACTIVE',
          business: {
            verified: true
          }
        },
        orderBy: {
          rating: 'desc'
        },
        take: 8,
        include: {
          media: {
            where: { featured: true }
          },
          category: true,
          address: true,
          business: {
            select: {
              verified: true
            }
          }
        }
      }),
      // trending: popular services' venues (simulated by review count for now)
      prisma.venue.findMany({
        where: {
          status: 'ACTIVE'
        },
        orderBy: {
          reviewCount: 'desc'
        },
        take: 8,
        include: {
          media: {
            where: { featured: true }
          },
          category: true,
          address: true,
          business: {
            select: {
              verified: true
            }
          }
        }
      }),
      // newArrivals: recently created
      prisma.venue.findMany({
        where: {
          status: 'ACTIVE'
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 8,
        include: {
          media: {
            where: { featured: true }
          },
          category: true,
          address: true,
          business: {
            select: {
              verified: true
            }
          }
        }
      }),
      // popularCategories
      prisma.category.findMany({
        where: { status: 'ACTIVE' },
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
      // trendingServices
      prisma.service.findMany({
        where: { popular: true, deletedAt: null },
        take: 12,
        orderBy: { createdAt: 'desc' }
      }),
      // communityMedia: recent featured media from portfolios or venues
      prisma.media.findMany({
        where: {
          OR: [
            { entityType: 'PORTFOLIO' },
            { entityType: 'VENUE', featured: true }
          ]
        },
        take: 7,
        orderBy: { createdAt: 'desc' },
        include: {
          venue: {
            select: {
              name: true,
              slug: true,
              category: { select: { name: true } }
            }
          }
        }
      }),
      // communities: recently created or active
      prisma.community.findMany({
        where: { status: 'ACTIVE' },
        take: 6,
        orderBy: { createdAt: 'desc' }
      })
    ])

    return {
      recommended,
      trending,
      newArrivals,
      popularCategories,
      trendingServices,
      communityMedia,
      communities
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
