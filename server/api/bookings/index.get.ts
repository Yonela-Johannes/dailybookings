import { serverSupabaseUser } from '#supabase/server'
import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  return await prisma.booking.findMany({
    where: { userId: user.id },
    include: {
      venue: {
        select: {
          id: true,
          name: true,
          slug: true,
          address: true
        }
      },
      services: {
        include: {
          service: true
        }
      },
      payment: true
    },
    orderBy: { date: 'desc' }
  })
})
