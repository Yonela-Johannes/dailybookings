import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)

  const [userCount, venueCount, bookingCount, revenueResult] = await Promise.all([
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
    })
  ])

  return {
    totalUsers: userCount,
    totalVenues: venueCount,
    totalBookings: bookingCount,
    totalRevenue: revenueResult._sum.priceTotal || 0
  }
})
