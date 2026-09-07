import { z } from 'zod'
import { isPlatformAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { UserRole } from '@prisma/client'

const bodySchema = z.object({
  fullName: z.string().min(1).optional(),
  role: z.nativeEnum(UserRole).optional(),
})

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const id = getRouterParam(event, 'id')

  const body = await readBody(event)
  const result = bodySchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid body parameters',
      data: result.error.format(),
    })
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: result.data,
      include: {
        profile: true
      }
    })

    return user
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }
    throw error
  }
})
