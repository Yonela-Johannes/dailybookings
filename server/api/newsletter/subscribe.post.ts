import { prisma } from '~/server/utils/prisma'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const { email } = subscribeSchema.parse(body)

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email, active: true }
    })

    return { success: true, message: 'Subscribed successfully' }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email address'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to subscribe: ' + error.message
    })
  }
})
