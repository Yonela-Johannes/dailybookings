import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { z } from 'zod'

const messageSchema = z.object({
  conversationId: z.string().uuid(),
  body: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  try {
    const { conversationId, body: messageBody } = messageSchema.parse(body)

    // Verify participation
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: user.id
        }
      }
    })

    if (!participant) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    const message = await prisma.$transaction(async (tx) => {
      const msg = await tx.message.create({
        data: {
          conversationId,
          senderId: user.id,
          body: messageBody
        },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              profile: { select: { avatarUrl: true } }
            }
          }
        }
      })

      await tx.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
      })

      return msg
    })

    return message
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to send message: ' + (error.errors?.[0]?.message || error.message)
    })
  }
})
