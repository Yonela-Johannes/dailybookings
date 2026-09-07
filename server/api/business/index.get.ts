import { prisma } from '~/server/utils/prisma'
import { isBusinessOwner } from '~/server/utils/auth'
import { startOfDay, endOfDay } from 'date-fns'

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

  const [todayBookingsCount, totalBookingsCount, todayRevenue, upcomingBookings] = await Promise.all([
    prisma.booking.count({
      where: {
        venueId: { in: venueIds },
        date: {
          gte: startOfTodayDate,
          lte: endOfTodayDate
        },
        status: { not: 'CANCELLED' }
      }
    }),
    prisma.booking.count({
      where: {
        venueId: { in: venueIds },
        status: { not: 'CANCELLED' }
      }
    }),
    prisma.booking.aggregate({
      where: {
        venueId: { in: venueIds },
        date: {
          gte: startOfTodayDate,
          lte: endOfTodayDate
        },
        status: 'COMPLETED'
      },
      _sum: {
        priceTotal: true
      }
    }),
    prisma.booking.findMany({
      where: {
        venueId: { in: venueIds },
        date: { gte: startOfTodayDate },
        status: 'CONFIRMED'
      },
      take: 5,
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ],
      include: {
        user: {
          select: {
            fullName: true,
            email: true
          }
        },
        services: {
          include: {
            service: true
          }
        }
      }
    })
  ])

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
    mainVenueSlug
  }
})
