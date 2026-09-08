import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { z } from 'zod'

const joinSchema = z.object({
  communityId: z.string().uuid(),
  action: z.enum(['join', 'leave'])
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  try {
    const { communityId, action } = joinSchema.parse(body)

    if (action === 'join') {
      await prisma.community.update({
        where: { id: communityId },
        data: {
          members: {
            connect: { id: user.id }
          }
        }
      })
    } else {
      await prisma.community.update({
        where: { id: communityId },
        data: {
          members: {
            disconnect: { id: user.id }
          }
        }
      })
    }

    return { success: true }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Operation failed',
      data: error.message
    })
  }
})
