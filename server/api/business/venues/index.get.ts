import { PrismaClient } from '@prisma/client'
import { isBusinessOwner } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await isBusinessOwner(event)

  const venues = await prisma.venue.findMany({
    where: user.role === 'PLATFORM_ADMIN' ? {} : {
      business: {
        ownerId: user.id
      }
    },
    include: {
      category: true,
      _count: {
        select: {
          employees: true,
          bookings: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return venues
})
