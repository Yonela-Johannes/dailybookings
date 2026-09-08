import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'
import { subDays, format } from 'date-fns'

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)

  const lastWeek = subDays(new Date(), 7)

  const [
    userCount,
    venueCount,
    bookingCount,
    communityCount,
    revenueResult,
    recentBookings,
    recentUsers,
    growthData,
    prevUserCount,
    prevVenueCount,
    prevBookingCount,
    prevRevenueResult
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.venue.count({ where: { deletedAt: null } }),
    prisma.booking.count({ where: { deletedAt: null } }),
    prisma.community.count(),
    prisma.booking.aggregate({
      where: { status: { in: ['CONFIRMED', 'COMPLETED'] }, deletedAt: null },
      _sum: { priceTotal: true }
    }),
    prisma.booking.findMany({
      where: { deletedAt: null },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true, email: true } },
        venue: { select: { name: true, slug: true } }
      }
    }),
    prisma.user.findMany({
      where: { deletedAt: null },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, fullName: true, email: true, role: true, createdAt: true }
    }),
    prisma.booking.groupBy({
      by: ['date'],
      where: { date: { gte: subDays(new Date(), 7) }, deletedAt: null },
      _count: { id: true },
      orderBy: { date: 'asc' }
    }),
    // Previous week counts for change calculation
    prisma.user.count({ where: { createdAt: { lt: lastWeek }, deletedAt: null } }),
    prisma.venue.count({ where: { createdAt: { lt: lastWeek }, deletedAt: null } }),
    prisma.booking.count({ where: { createdAt: { lt: lastWeek }, deletedAt: null } }),
    prisma.booking.aggregate({
      where: { createdAt: { lt: lastWeek }, status: { in: ['CONFIRMED', 'COMPLETED'] }, deletedAt: null },
      _sum: { priceTotal: true }
    })
  ])

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const diff = ((current - previous) / previous) * 100;
    return (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%';
  }

  const userChange = calculateChange(userCount, prevUserCount);
  const venueChange = calculateChange(venueCount, prevVenueCount);
  const bookingChange = calculateChange(bookingCount, prevBookingCount);
  const revenueChange = calculateChange(Number(revenueResult._sum.priceTotal || 0), Number(prevRevenueResult._sum.priceTotal || 0));

  // Map growth data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)
    return d
  })

  const mappedGrowth = last7Days.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const found = growthData.find(g => format(new Date(g.date), 'yyyy-MM-dd') === dateStr)
    return found ? found._count.id : 0
  })

  const maxBookings = Math.max(...mappedGrowth, 1)
  const growthPercentages = mappedGrowth.map(count => Math.round((count / maxBookings) * 100))

  return {
    totalUsers: userCount,
    totalVenues: venueCount,
    totalBookings: bookingCount,
    totalCommunities: communityCount,
    totalRevenue: Number(revenueResult._sum.priceTotal || 0),
    userChange,
    venueChange,
    bookingChange,
    revenueChange,
    recentBookings,
    recentUsers,
    growthPercentages
  }
})
