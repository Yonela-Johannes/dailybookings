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
    // 1. Try to find the user by Supabase ID
    let dbUser = await prisma.user.findUnique({
      where: { id: data.id }
    })

    // 2. If not found, try by Email (migration/seed scenario)
    if (!dbUser) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email: data.email }
      })

      if (existingByEmail) {
        // Migration: Update the existing user record with the new Supabase ID
        // Note: Prisma doesn't support updating the ID field directly in a simple way.
        // We have to delete and recreate, or use a raw query.
        // Since we want to preserve relations, let's use a raw query to update the ID.
        await prisma.$executeRawUnsafe(
          `UPDATE "User" SET "id" = $1 WHERE "id" = $2`,
          data.id,
          existingByEmail.id
        )

        // Now fetch it again with the new ID
        dbUser = await prisma.user.findUnique({
          where: { id: data.id }
        })
      }
    }

    const updateData: any = {
      email: data.email,
      fullName: data.fullName,
    }

    // Role Handling
    if (data.role) {
      if (dbUser) {
        if (dbUser.role === 'PLATFORM_ADMIN') {
          updateData.role = 'PLATFORM_ADMIN'
        } else if (data.role === 'PLATFORM_ADMIN') {
          updateData.role = 'PLATFORM_ADMIN'
        } else {
          updateData.role = data.role
        }
      } else {
        updateData.role = data.role
      }
    }

    dbUser = await prisma.user.upsert({
      where: { id: data.id },
      update: updateData,
      create: {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role || 'CUSTOMER'
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
