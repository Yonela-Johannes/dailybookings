import { PrismaClient } from '@prisma/client'
import { isPlatformAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  await isPlatformAdmin(event)

  const users = await prisma.user.findMany({
    include: {
      profile: true,
      _count: {
        select: {
          businesses: true,
          bookings: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return users
})
