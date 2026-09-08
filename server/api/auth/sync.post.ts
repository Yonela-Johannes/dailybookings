import { prisma } from '~/server/utils/prisma'
import { z } from 'zod'
import { serverSupabaseClient } from '#supabase/server'

const syncUserSchema = z.object({
  id: z.string(),
  email: z.string().trim().email().toLowerCase(),
  fullName: z.string().trim().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  role: z.enum(['CUSTOMER', 'BUSINESS_OWNER', 'PLATFORM_ADMIN']).optional()
})

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data: { user } } = await client.auth.getUser()
  const body = await readBody(event)

  // Validation
  const data = syncUserSchema.parse(body)

  // Security: Ensure the user can only sync their own data
  // Unless there is no session (e.g. during registration sync if cookies aren't set yet)
  // But usually sign-up sets the session.
  if (user && user.id !== data.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Cannot sync another user'
    })
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: data.id }
    })

    const updateData: any = {
      email: data.email,
      fullName: data.fullName,
    }

    if (data.role) {
      if (data.role === 'PLATFORM_ADMIN') {
        if (!existingUser || existingUser.role !== 'PLATFORM_ADMIN') {
           updateData.role = 'CUSTOMER'
        } else {
           updateData.role = 'PLATFORM_ADMIN'
        }
      } else {
        updateData.role = data.role
      }
    }

    const dbUser = await prisma.user.upsert({
      where: { id: data.id },
      update: updateData,
      create: {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: (data.role === 'PLATFORM_ADMIN') ? 'CUSTOMER' : (data.role || 'CUSTOMER')
      }
    })

    // Also sync profile
    await prisma.profile.upsert({
      where: { userId: data.id },
      update: {
        avatarUrl: data.avatarUrl
      },
      create: {
        userId: data.id,
        avatarUrl: data.avatarUrl
      }
    })

    // Return the full user data as /api/me does
    const fullUser = await prisma.user.findUnique({
      where: { id: dbUser.id },
      include: {
        profile: true,
        businesses: {
          include: {
            venues: {
              select: {
                slug: true
              },
              take: 1
            }
          }
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
            favorites: true
          }
        }
      }
    })

    // Convert any potential non-serializable objects (though User usually doesn't have them)
    // But let's be safe if we add price/revenue later
    return fullUser
  } catch (error: any) {
    console.error('Auth sync error:', error)
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user data or sync failed',
      data: error.message
    })
  }
})
