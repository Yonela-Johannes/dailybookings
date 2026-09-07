import { isPlatformAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { z } from 'zod'

const updateCategorySchema = z.object({
  name: z.string().min(2).max(50).optional(),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with hyphens').optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  icon: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional()
})

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    const data = updateCategorySchema.parse(body)

    const category = await prisma.category.update({
      where: { id },
      data
    })

    return category
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
