import { prisma } from '~/server/utils/prisma'
import { isBusinessOwner } from '~/server/utils/auth'
import { startOfDay, endOfDay, subDays } from 'date-fns'

export default defineEventHandler(async (event) => {

  const user = await isBusinessOwner(event)

  // Find all venues owned by this user (through business)
  const venues = await prisma.venue.findMany({
    where: user.role === 'PLATFORM_ADMIN' ? {} : {
      business: {
        ownerId: user.id
      }
    },
    select: { id: true, slug: true }
  })

  const venueIds = venues.map(v => v.id)
  const mainVenueSlug = venues[0]?.slug

  const today = new Date()
  const startOfTodayDate = startOfDay(today)
  const endOfTodayDate = endOfDay(today)

  const yesterday = subDays(today, 1)
  const startOfYesterdayDate = startOfDay(yesterday)
  const endOfYesterdayDate = endOfDay(yesterday)

  const [
    todayBookingsCount,
    totalBookingsCount,
    todayRevenue,
    upcomingBookings,
    yesterdayBookingsCount,
    yesterdayRevenue,
    reviewsResult,
    lastMonthReviewsResult
  ] = await Promise.all([
    prisma.booking.count({
      where: { venueId: { in: venueIds }, date: { gte: startOfTodayDate, lte: endOfTodayDate }, status: { not: 'CANCELLED' } }
    }),
    prisma.booking.count({
      where: { venueId: { in: venueIds }, status: { not: 'CANCELLED' } }
    }),
    prisma.booking.aggregate({
      where: { venueId: { in: venueIds }, date: { gte: startOfTodayDate, lte: endOfTodayDate }, status: 'COMPLETED' },
      _sum: { priceTotal: true }
    }),
    prisma.booking.findMany({
      where: { venueId: { in: venueIds }, date: { gte: startOfTodayDate }, status: 'CONFIRMED' },
      take: 5,
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      include: {
        user: { select: { fullName: true, email: true } },
        services: { include: { service: true } }
      }
    }),
    prisma.booking.count({
      where: { venueId: { in: venueIds }, date: { gte: startOfYesterdayDate, lte: endOfYesterdayDate }, status: { not: 'CANCELLED' } }
    }),
    prisma.booking.aggregate({
      where: { venueId: { in: venueIds }, date: { gte: startOfYesterdayDate, lte: endOfYesterdayDate }, status: 'COMPLETED' },
      _sum: { priceTotal: true }
    }),
    prisma.review.aggregate({
      where: { venueId: { in: venueIds } },
      _avg: { rating: true },
      _count: true
    }),
    prisma.review.aggregate({
      where: { venueId: { in: venueIds }, createdAt: { lt: subDays(new Date(), 30) } },
      _avg: { rating: true }
    })
  ])

  // Calculate changes
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const diff = ((current - previous) / previous) * 100;
    return (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%';
  }

  const bookingsChange = calculateChange(todayBookingsCount, yesterdayBookingsCount);
  const revenueChange = calculateChange(Number(todayRevenue._sum.priceTotal || 0), Number(yesterdayRevenue._sum.priceTotal || 0));

  const reputation = reviewsResult._avg.rating || 0;
  const lastMonthReputation = lastMonthReviewsResult._avg.rating || 0;
  const reputationChangeVal = reputation - lastMonthReputation;
  const reputationChange = (reputationChangeVal >= 0 ? '+' : '') + reputationChangeVal.toFixed(1);

  // Convert Decimal to number for serialization
  const upcomingBookingsClean = upcomingBookings.map(b => ({
    ...b,
    priceTotal: Number(b.priceTotal),
    services: b.services.map(s => ({
      ...s,
      price: Number(s.price)
    }))
  }))

  return {
    todayBookingsCount,
    totalBookingsCount,
    todayRevenue: Number(todayRevenue._sum.priceTotal || 0),
    upcomingBookings: upcomingBookingsClean,
    mainVenueSlug,
    bookingsChange,
    revenueChange,
    reputation: reputation.toFixed(1),
    reputationChange
  }
})
