import { PrismaClient } from '@prisma/client'
import { isPlatformAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  await isPlatformAdmin(event)

  const venues = await prisma.venue.findMany({
    include: {
      business: {
        include: {
          owner: {
            select: {
              email: true,
              fullName: true
            }
          }
        }
      },
      category: true,
      _count: {
        select: {
          bookings: true,
          reviews: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return venues
})
