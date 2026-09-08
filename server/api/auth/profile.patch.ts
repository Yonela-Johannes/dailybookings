import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { z } from 'zod'

const profileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal(''))
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  try {
    const data = profileSchema.parse(body)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { fullName: data.fullName }
      }),
      prisma.profile.upsert({
        where: { userId: user.id },
        update: {
          phone: data.phone,
          bio: data.bio,
          avatarUrl: data.avatarUrl
        },
        create: {
          userId: user.id,
          phone: data.phone,
          bio: data.bio,
          avatarUrl: data.avatarUrl
        }
      })
    ])

    return { success: true }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to update profile: ' + (error.errors?.[0]?.message || error.message)
    })
  }
})
