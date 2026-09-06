import { PrismaClient } from '@prisma/client'
import { isBusinessOwner } from '~/server/utils/auth'
import { startOfDay, endOfDay, startOfToday } from 'date-fns'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await isBusinessOwner(event)

  // Find all venues owned by this user (through business)
  const venues = await prisma.venue.findMany({
    where: user.role === 'PLATFORM_ADMIN' ? {} : {
      business: {
        ownerId: user.id
      }
    },
    select: { id: true }
  })

  const venueIds = venues.map(v => v.id)

  const today = new Date()
  const startOfTodayDate = startOfDay(today)
  const endOfTodayDate = endOfDay(today)

  const [todayBookingsCount, todayRevenue, upcomingBookings] = await Promise.all([
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

  return {
    todayBookingsCount,
    todayRevenue: todayRevenue._sum.priceTotal || 0,
    upcomingBookings
  }
})
