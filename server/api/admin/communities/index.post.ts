import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'
import { z } from 'zod'

const createCommunitySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE')
})

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const body = await readBody(event)

  try {
    const data = createCommunitySchema.parse(body)

    const community = await prisma.community.create({
      data: {
        ...data,
        imageUrl: data.imageUrl || null
      }
    })

    return community
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: error.errors
      })
    }
    throw error
  }
})
