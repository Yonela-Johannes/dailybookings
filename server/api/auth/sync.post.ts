import { prisma } from '~/server/utils/prisma'
import { z } from 'zod'

const syncUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  role: z.enum(['CUSTOMER', 'BUSINESS_OWNER', 'PLATFORM_ADMIN']).optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const data = syncUserSchema.parse(body)

    const user = await prisma.user.upsert({
      where: { id: data.id },
      update: {
        email: data.email,
        fullName: data.fullName,
        role: data.role
      },
      create: {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role || 'CUSTOMER'
      }
    })

    // Also sync profile
    if (data.avatarUrl) {
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
    }

    return {
      status: 'success',
      user
    }
  } catch (error: any) {
    console.error('Auth sync error:', error)
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user data or sync failed',
      data: error.message
    })
  }
})
