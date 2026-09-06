import { serverSupabaseUser } from '#supabase/server'
import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      profile: true,
      _count: {
        select: {
          bookings: true,
          reviews: true,
          favorites: true
        }
      }
    }
  })

  if (!userData) {
    throw createError({ statusCode: 404, statusMessage: 'User not found in database' })
  }

  return userData
})
