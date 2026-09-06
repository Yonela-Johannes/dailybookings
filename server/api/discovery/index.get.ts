import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {

  try {
    const [recommended, trending, newArrivals, popularCategories] = await Promise.all([
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
      // trending: popular services' venues (simulated by rating for now)
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
      })
    ])

    return {
      recommended,
      trending,
      newArrivals,
      popularCategories
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
