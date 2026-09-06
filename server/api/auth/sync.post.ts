import { prisma } from '~/server/utils/prisma'
import { z } from 'zod'

const syncUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
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
        avatarUrl: data.avatarUrl,
        role: data.role
      },
      create: {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        avatarUrl: data.avatarUrl,
        role: data.role || 'CUSTOMER'
      }
    })

    return {
      status: 'success',
      user
    }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user data or sync failed',
      data: error.message
    })
  }
})
