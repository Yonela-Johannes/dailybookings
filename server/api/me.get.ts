import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {

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
