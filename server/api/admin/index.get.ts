import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)

  const [userCount, venueCount, bookingCount, revenueResult, recentBookings, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.venue.count(),
    prisma.booking.count(),
    prisma.booking.aggregate({
      where: {
        status: {
          in: ['CONFIRMED', 'COMPLETED']
        }
      },
      _sum: {
        priceTotal: true
      }
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true, email: true } },
        venue: { select: { name: true, slug: true } }
      }
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true
      }
    })
  ])

  return {
    totalUsers: userCount,
    totalVenues: venueCount,
    totalBookings: bookingCount,
    totalRevenue: Number(revenueResult._sum.priceTotal || 0),
    recentBookings,
    recentUsers
  }
})
