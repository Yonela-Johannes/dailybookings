import { prisma } from '~/server/utils/prisma'
import { isPlatformAdmin } from '~/server/utils/auth'
import { z } from 'zod'

const updateCommunitySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional()
})

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    const data = updateCommunitySchema.parse(body)

    const community = await prisma.community.update({
      where: { id },
      data: {
        ...data,
        imageUrl: data.imageUrl === '' ? null : data.imageUrl
      }
    })

    return community
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Update failed',
      data: error.message
    })
  }
})
