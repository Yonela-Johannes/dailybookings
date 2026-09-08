import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { z } from 'zod'

const startSchema = z.object({
  recipientId: z.string().uuid()
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  try {
    const { recipientId } = startSchema.parse(body)

    if (user.id === recipientId) {
      throw createError({ statusCode: 400, statusMessage: 'Cannot start conversation with yourself' })
    }

    // Check if conversation already exists
    const existing = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: user.id } } },
          { participants: { some: { userId: recipientId } } }
        ]
      }
    })

    if (existing) {
      return existing
    }

    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId: user.id },
            { userId: recipientId }
          ]
        }
      }
    })

    return conversation
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to start conversation: ' + (error.errors?.[0]?.message || error.message)
    })
  }
})
